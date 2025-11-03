import { normalizeText } from '@/lib/search';
import { INTENTS, VoiceIntent } from './intents';

export interface MatchIntentResult {
  intentId: string | null;
  intent: VoiceIntent | null;
  score: number;
  reason: string;
}

export interface MatchIntentOptions {
  threshold?: number;
  intents?: VoiceIntent[];
}

const DEFAULT_THRESHOLD = 55;

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

function ratioScore(len: number, distance: number, maxScore: number): number {
  if (len === 0) return 0;
  const similarity = Math.max(0, len - distance) / len;
  return Math.round(similarity * maxScore);
}

function scoreIntent(
  transcript: string,
  transcriptCompact: string,
  transcriptTokens: Set<string>,
  intent: VoiceIntent,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const displayNorm = normalizeText(intent.displayName);
  const displayCompact = displayNorm.replace(/\s+/g, '');

  if (displayNorm && transcript === displayNorm) {
    score += 120;
    reasons.push('exact:displayName');
  } else if (displayNorm && transcript.includes(displayNorm)) {
    score += 70;
    reasons.push('includes:displayName');
  } else if (displayCompact && transcriptCompact.includes(displayCompact)) {
    score += 45;
    reasons.push('compact:displayName');
  }

  const keywordHits: string[] = [];
  intent.keywords.forEach((kw) => {
    const norm = normalizeText(kw);
    if (!norm) return;
    const compact = norm.replace(/\s+/g, '');
    if (transcript.includes(norm) || transcriptCompact.includes(compact) || transcriptTokens.has(norm)) {
      keywordHits.push(kw);
    }
  });
  if (keywordHits.length > 0) {
    const add = 25 * keywordHits.length;
    score += add;
    reasons.push(`keywords:${keywordHits.join(',')}`);
  }

  const aliasHits: string[] = [];
  intent.aliases.forEach((alias) => {
    const norm = normalizeText(alias);
    if (!norm) return;
    const compact = norm.replace(/\s+/g, '');
    if (transcript.includes(norm) || transcriptCompact.includes(compact)) {
      aliasHits.push(alias);
    } else {
      const dist = levenshtein(transcriptCompact, compact);
      if (dist <= 2) {
        aliasHits.push(alias);
      }
    }
  });
  if (aliasHits.length > 0) {
    const add = 18 * aliasHits.length;
    score += add;
    reasons.push(`aliases:${aliasHits.join(',')}`);
  }

  intent.patterns.forEach((pattern) => {
    const norm = normalizeText(pattern);
    if (!norm) return;
    const compact = norm.replace(/\s+/g, '');
    if (transcript.includes(norm) || transcriptCompact.includes(compact)) {
      score += 65;
      reasons.push(`pattern:${pattern}`);
      return;
    }
    const dist = levenshtein(transcriptCompact, compact);
    if (dist <= 4) {
      const add = ratioScore(Math.max(transcriptCompact.length, compact.length), dist, 55);
      if (add > 0) {
        score += add;
        reasons.push(`patternFuzzy:${pattern}:${add}`);
      }
    }
  });

  if (intent.menuPath) {
    const pathNorm = normalizeText(intent.menuPath);
    const pathTokens = new Set(pathNorm.split(' ').filter(Boolean));
    const hit = [...pathTokens].filter((token) => transcriptTokens.has(token));
    if (hit.length > 0) {
      const add = 8 * hit.length;
      score += add;
      reasons.push(`menuTokens:${hit.join(',')}`);
    }
  }

  return { score, reasons };
}

export function matchIntent(
  transcriptRaw: string,
  options: MatchIntentOptions = {},
): MatchIntentResult {
  const intents = options.intents ?? INTENTS;
  const threshold = options.threshold ?? DEFAULT_THRESHOLD;
  if (!transcriptRaw || !transcriptRaw.trim()) {
    return {
      intentId: null,
      intent: null,
      score: 0,
      reason: 'transcript_empty',
    };
  }

  const normalized = normalizeText(transcriptRaw);
  if (!normalized) {
    return {
      intentId: null,
      intent: null,
      score: 0,
      reason: 'transcript_normalized_empty',
    };
  }

  const transcriptCompact = normalized.replace(/\s+/g, '');
  const transcriptTokens = new Set(normalized.split(' ').filter(Boolean));

  let bestIntent: VoiceIntent | null = null;
  let bestScore = -Infinity;
  let bestReasons: string[] = [];

  intents.forEach((intent) => {
    const { score, reasons } = scoreIntent(normalized, transcriptCompact, transcriptTokens, intent);
    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
      bestReasons = reasons;
    }
  });

  if (!bestIntent) {
    return {
      intentId: null,
      intent: null,
      score: 0,
      reason: 'no_intents_registered',
    };
  }

  if (bestScore < threshold) {
    return {
      intentId: null,
      intent: null,
      score: Math.max(0, bestScore),
      reason: `low_confidence:${bestIntent.id}:${bestScore};${bestReasons.join('|')}`,
    };
  }

  return {
    intentId: bestIntent.id,
    intent: bestIntent,
    score: bestScore,
    reason: bestReasons.join('|'),
  };
}

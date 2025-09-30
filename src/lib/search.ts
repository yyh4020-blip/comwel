// src/lib/search.ts
export type SearchItem = {
  id: number | string;
  title: string;
  shortDesc?: string;
  menuPath?: string;
  description?: string;
  keywords?: string[];
};

export type Ranked = { item: SearchItem; score: number; reasons: string[] };

export function normalizeText(s: string): string {
  if (!s) return "";
  let out = s.normalize("NFC").toLowerCase();
  // 특수문자 -> 공백, 다중 공백 정리
  out = out.replace(/[^\p{L}\p{N}\s/.-]+/gu, " ").replace(/\s+/g, " ").trim();

  // 간단 조사 제거(토큰 끝 기준)
  const josa = /(을|를|이|가|은|는|에|에서|으로|로|과|와|랑|에게|께|도|만|부터|까지|의)$/;
  out = out
    .split(" ")
    .map((t) => t.replace(josa, ""))
    .join(" ");

  return out;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function scoreWorkItem(queryRaw: string, item: SearchItem): Ranked {
  const q = normalizeText(queryRaw);
  const title = normalizeText(item.title || "");
  const desc  = normalizeText(item.shortDesc || item.description || "");
  const menu  = normalizeText(item.menuPath || "");
  const keys  = normalizeText((item.keywords || []).join(" "));

  let score = 0;
  const reasons: string[] = [];

  // 1) 정확/시작 일치(제목)
  if (q === title) { score += 100; reasons.push("exact:title"); }
  if (title.startsWith(q)) { score += 40; reasons.push("startsWith:title"); }

  // 2) 토큰 교집합(제목+키워드+요약)
  const qt = new Set(q.split(" ").filter(Boolean));
  const dt = new Set([title, keys, desc].join(" ").split(" ").filter(Boolean));
  const inter = [...qt].filter(t => dt.has(t)).length;
  if (qt.size) {
    const add = Math.round((inter / qt.size) * 50); // 0~50
    score += add;
    if (add > 0) reasons.push(`token:${add}`);
  }

  // 3) 메뉴 경로 포함
  if (menu && menu.includes(q)) { score += 20; reasons.push("menuPath:contains"); }

  // 4) 퍼지(제목 중심)
  const qC = q.replace(/\s+/g, "");
  const tC = title.replace(/\s+/g, "");
  const d = levenshtein(qC, tC);
  if (d <= 1) { score += 25; reasons.push("fuzzy:<=1"); }
  else if (d === 2) { score += 10; reasons.push("fuzzy:2"); }

  return { item, score, reasons };
}

export function searchWork(
  query: string,
  items: SearchItem[],
  threshold = 40
): { result: Ranked | null; candidates: Ranked[] } {
  const ranked = items.map(i => scoreWorkItem(query, i))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0] ?? null;
  if (!top || top.score < threshold) return { result: null, candidates: ranked.slice(0, 3) };
  return { result: top, candidates: ranked.slice(1, 3) };
}

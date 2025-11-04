import rawIntents from './intents-data.json';

export interface VoiceIntent {
  id: string;
  workId: number;
  displayName: string;
  menuPath: string;
  keywords: string[];
  aliases: string[];
  patterns: string[];
}

type VoiceIntentSource = {
  id: string;
  workId: number;
  displayName: string;
  menuPath: string;
  keywords?: string[];
  aliases?: string[];
  patterns?: string[];
};

export const INTENTS: VoiceIntent[] = (rawIntents as VoiceIntentSource[]).map((intent) => ({
  ...intent,
  keywords: intent.keywords ?? [],
  aliases: intent.aliases ?? [],
  patterns: intent.patterns ?? [],
}));

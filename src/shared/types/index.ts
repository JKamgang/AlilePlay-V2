import React from 'react';
import { TranslationMessages } from '../lib/i18n/translations';

export type Language = 'en' | 'es' | 'fr' | 'zh';

export type GameMode = 'player' | 'ai' | 'team';

export interface GameOption {
  labelKey: keyof TranslationMessages;
  value: string;
}

export interface GameModeOption {
  labelKey: keyof TranslationMessages;
  value: GameMode;
}

export interface Game {
  id: string;
  nameKey: keyof TranslationMessages;
  descriptionKey: keyof TranslationMessages;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  status: 'playable' | 'coming_soon';
  categoryKey: keyof TranslationMessages;
  options?: GameOption[];
  modes?: GameModeOption[];
}

export interface WordAnalysis {
    definition: string;
    synonyms?: string[];
    antonyms?: string[];
    example?: string;
    etymology?: string;
    score?: number;
}

export interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar: string;
  overallScore: number;
  scores: {
    [gameId: string]: number;
  };
}

export interface Tournament {
    id: string;
    gameKey: keyof TranslationMessages;
    prize: string;
    startsInKey: keyof TranslationMessages;
}

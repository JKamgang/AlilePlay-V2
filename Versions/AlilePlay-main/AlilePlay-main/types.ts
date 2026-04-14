
import React from 'react';

export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  ZH = 'zh',
  PT = 'pt',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface User {
  name: string;
  role: 'public' | 'tester' | 'admin';
  preferences: {
    theme: Theme;
    language: Language;
    skillLevels: Record<string, string>;
  };
  subscription: {
    planId: string;
    gamesPlayedThisMonth: number;
    gamePlays: Record<string, number>;
  };
}

export interface Game {
  id: string;
  nameKey: string;
  categoryKey: string;
  status: 'playable' | 'coming_soon';
  enabled: boolean;
  visible: boolean;
  component: React.ComponentType<{ game: Game; options: any; setOptions: (options: any) => void }>;
  descriptionKey: string;
  rulesKey: string;
  historyKey: string;
  funFactsKey: string[];
  options?: GameOption[];
}

export interface GameOption {
  id: string;
  labelKey: string;
  type: 'select' | 'toggle';
  values?: { value: string | number; labelKey: string }[];
  defaultValue: string | number | boolean;
}

export interface MonetizationPlan {
  id: string;
  nameKey: string;
  price: number;
  featuresKey: string[];
  isFeatured: boolean;
  monthlyGameLimit?: number;
  perGameLimit?: number;
}

export type AppView = 'library' | 'game' | 'pricing' | 'about' | 'feedback';

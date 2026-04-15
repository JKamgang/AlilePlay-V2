import type { ComponentType } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'zh';

export interface GameOption {
  label: string;
  value: string;
}

export interface Game {
    id: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    description: string;
    status: 'playable' | 'coming-soon';
    category: 'classic_board' | 'strategy' | 'card_games' | 'puzzle_games' | 'modern_classics' | 'digital_strategy' | 'simulation_creative';
    options?: GameOption[];
}

export interface ChatMessage {
    id: number;
    user: string;
    text: string;
    isFlagged: boolean;
}

export interface WordAnalysis {
    definition: string;
    synonyms?: string[];
    antonyms?: string[];
    example?: string;
    etymology?: string;
}

export type Translations = {
    [key: string]: {
        [lang in Language]: string;
    }
}
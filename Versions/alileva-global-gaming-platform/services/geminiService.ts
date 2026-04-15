// This is a MOCK service to demonstrate how Gemini API integration would be structured.
// In a real application, this would use `@google/genai` to make API calls.
// For this frontend-only prototype, it returns mock data after a delay.

import { MOCK_ANALYTICS_DATA } from '../constants';
import { WordAnalysis } from '../types';

// Simulates an AI call to get platform analytics or marketing insights.
export const getMockAnalytics = (): Promise<any[]> => {
    console.log("Simulating Gemini API call for analytics...");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Mock Gemini response received.");
            resolve(MOCK_ANALYTICS_DATA);
        }, 800); // Simulate network latency
    });
};

// Simulates AI-powered chat moderation.
export const moderateChatMessage = async (message: string): Promise<{ isAggressive: boolean }> => {
    console.log(`Simulating Gemini API call to moderate message: "${message}"`);
    // Simple mock logic
    const aggressiveKeywords = ['crush', 'destroy', 'hate'];
    const isAggressive = aggressiveKeywords.some(keyword => message.toLowerCase().includes(keyword));

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ isAggressive });
        }, 300);
    });
};

// Mock dictionary data for the AI Word Coach
const MOCK_DICTIONARY: { [key: string]: WordAnalysis } = {
    'HELLO': {
        definition: 'Used as a greeting or to begin a phone conversation.',
        synonyms: ['Hi', 'Greetings', 'Hey'],
        antonyms: ['Goodbye', 'Bye'],
        example: '"Hello there, Jean!"',
        etymology: 'Early 19th century: variant of hallo; related to hollo.'
    },
    'WORLD': {
        definition: 'The earth, together with all of its countries and peoples.',
        synonyms: ['Earth', 'Globe', 'Planet'],
        example: 'He is known throughout the world.',
        etymology: 'Old English w(e)oruld, from a Germanic compound meaning ‘age of man’.'
    },
    'GAMING': {
        definition: 'The action or practice of playing video games.',
        synonyms: ['Playing', 'Entertainment'],
        example: 'The gaming industry is larger than Hollywood.',
        etymology: 'From the verb "game", Old English gamen "joy, fun; game, amusement."'
    }
};

// Simulates an AI call to get a word's definition, synonyms, etc.
export const getWordAnalysis = async (word: string, detailLevel: 'basic' | 'full'): Promise<WordAnalysis | null> => {
    console.log(`Simulating Gemini API call for word analysis: "${word}" with detail: ${detailLevel}`);

    return new Promise(resolve => {
        setTimeout(() => {
            const result = MOCK_DICTIONARY[word.toUpperCase()];
            if (result) {
                if (detailLevel === 'basic') {
                    resolve({ definition: result.definition });
                } else {
                    resolve(result);
                }
            } else {
                resolve({ definition: 'Sorry, no definition found for this word.' });
            }
        }, 600);
    });
};

// Simulates an AI call to suggest the best possible word from a set of tiles.
export const suggestBestWord = async (tiles: string[]): Promise<{ word: string, points: number } | null> => {
    console.log(`Simulating Gemini API call for best word suggestion with tiles: ${tiles.join(', ')}`);

    return new Promise(resolve => {
        setTimeout(() => {
            // This is a very simple mock. A real implementation would be complex.
            if (tiles.includes('G') && tiles.includes('A') && tiles.includes('M')) {
                resolve({ word: 'GAMING', points: 25 });
            } else {
                resolve({ word: 'WORD', points: 18 });
            }
        }, 700);
    });
};
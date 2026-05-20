import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWordAnalysis } from './geminiService';

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: vi.fn().mockRejectedValue(new Error('API Error')),
            };
        },
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        },
    };
});

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.API_KEY = 'test-api-key';
    });

    describe('getWordAnalysis', () => {
        it('should return null when generateContent throws an error', async () => {
            // Suppress console.error for the expected error output
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const result = await getWordAnalysis('test', 'basic');

            expect(result).toBeNull();

            consoleSpy.mockRestore();
        });
    });
});

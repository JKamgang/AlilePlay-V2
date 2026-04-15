import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { moderateChatMessage } from './geminiService';

// Mock the GoogleGenAI client completely
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            };
        },
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        }
    };
});

describe('geminiService', () => {
    describe('moderateChatMessage', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            process.env.API_KEY = 'test-api-key';
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should handle errors when generation fails and return isAggressive: false', async () => {
            // Setup the mock to throw an error
            mockGenerateContent.mockRejectedValue(new Error('API Error'));

            // Call the function
            const result = await moderateChatMessage('some bad text');

            // Verify it handled the error gracefully and returned the default fallback
            expect(result).toEqual({ isAggressive: false });
            expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        });

        it('should return isAggressive: true when the API says yes', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'yes' });

            const result = await moderateChatMessage('bad word');

            expect(result).toEqual({ isAggressive: true });
        });

        it('should return isAggressive: false when the API says no', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'no' });

            const result = await moderateChatMessage('good word');

            expect(result).toEqual({ isAggressive: false });
        });
    });
});

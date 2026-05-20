import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { moderateChatMessage, getSupportResponse, getWordAnalysis, suggestBestWord } from './geminiService';

// Mock the GoogleGenAI client properly
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            }
        },
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER'
        }
    }
});

describe('geminiService', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        // Clear process.env variables
        process.env = { ...originalEnv };
        process.env.API_KEY = 'real-key';
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetAllMocks();
    });

    describe('getSupportResponse', () => {
        it('should handle errors when getting support response', async () => {
            const question = 'How do I play Chess?';

            // Make the generateContent call throw an error
            mockGenerateContent.mockRejectedValueOnce(new Error('Test Gemini Error'));

            // Spy on console.error to verify it's called
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const response = await getSupportResponse(question);

            expect(response).toBe('Sorry, our support systems are currently busy. Please try again later.');
            expect(consoleSpy).toHaveBeenCalledWith('Error getting support response:', expect.any(Error));

            consoleSpy.mockRestore();
        });

        it('should return valid response on success', async () => {
            mockGenerateContent.mockResolvedValueOnce({ text: 'You move pieces on a board.' });

            const response = await getSupportResponse('How do I play Chess?');

            expect(response).toBe('You move pieces on a board.');
        });

        it('should return fallback if response.text is empty', async () => {
            mockGenerateContent.mockResolvedValueOnce({ text: '' });

            const response = await getSupportResponse('How do I play Chess?');

            expect(response).toBe("I'm sorry, I couldn't process that right now.");
        });
    });
});

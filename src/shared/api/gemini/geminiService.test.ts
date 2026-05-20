import { describe, it, expect, vi, beforeEach } from 'vitest';
import { suggestBestWord } from './geminiService';

const { mockGenerateContent, mockGoogleGenAI } = vi.hoisted(() => {
    const mockGenerateContent = vi.fn();
    return {
        mockGenerateContent,
        mockGoogleGenAI: vi.fn().mockImplementation(function() {
            return {
                models: {
                    generateContent: mockGenerateContent
                }
            };
        })
    };
});

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: mockGoogleGenAI,
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        }
    };
});

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.API_KEY = 'test-api-key';

        // genAI client in the service is a singleton module variable.
        // If we want it to be cleanly mocked for each run without weird state,
        // we might need to reset modules but that can be tricky.
        // We'll see if clearing mocks is enough.
    });

    describe('suggestBestWord', () => {
        it('should return null when the API call throws an error', async () => {
            mockGenerateContent.mockRejectedValue(new Error('API failure'));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const result = await suggestBestWord(['A', 'B', 'C']);

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith("Error suggesting best word:", expect.any(Error));

            consoleSpy.mockRestore();
        });

        it('should return null when tiles array is empty', async () => {
            const result = await suggestBestWord([]);
            expect(result).toBeNull();
        });

        it('should return parsed JSON when the API call succeeds', async () => {
            mockGenerateContent.mockResolvedValue({
                text: '{"word": "CAB", "points": 7}'
            });

            const result = await suggestBestWord(['C', 'A', 'B']);

            expect(result).toEqual({ word: 'CAB', points: 7 });
        });
    });
});

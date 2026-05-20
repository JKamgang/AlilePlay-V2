import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { suggestBestWord } from './geminiService';


const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
    return {
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            INTEGER: 'INTEGER',
        },
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            }
        }
    };
});

describe('suggestBestWord', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv, API_KEY: 'test-api-key' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('returns null if tiles array is empty', async () => {
        const result = await suggestBestWord([]);
        expect(result).toBeNull();
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('returns word and points for valid tiles', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: JSON.stringify({ word: 'CAB', points: 7 })
        });

        const result = await suggestBestWord(['C', 'A', 'B']);
        expect(result).toEqual({ word: 'CAB', points: 7 });
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('returns null when API call throws an error', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await suggestBestWord(['X', 'Y', 'Z']);

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith("Error suggesting best word:", expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('handles malformed JSON response gracefully by returning null', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: 'not-json'
        });
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await suggestBestWord(['A', 'B']);

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});

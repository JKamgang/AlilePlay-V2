import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSupportResponse } from './geminiService';
import { GoogleGenAI } from '@google/genai';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(function() {
            return {
                models: {
                    generateContent: (...args: any[]) => mockGenerateContent(...args)
                }
            };
        }),
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        }
    };
});

describe('getSupportResponse', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGenerateContent.mockReset();
        process.env.API_KEY = 'test-api-key';
    });

    it('should return a fallback response when the API call fails', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API rate limit exceeded'));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const response = await getSupportResponse('How do I play chess?');

        expect(response).toBe('Sorry, our support systems are currently busy. Please try again later.');
        expect(consoleSpy).toHaveBeenCalledWith('Error getting support response:', expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('should return the API response when successful', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'Here is how you play chess.'
        });

        const response = await getSupportResponse('How do I play chess?');
        expect(response).toBe('Here is how you play chess.');
    });

    it('should return default fallback if text is missing in successful response', async () => {
        mockGenerateContent.mockResolvedValue({
            text: '' // or undefined, though text getter handles this typically. We can just return {} to simulate no text.
        });

        const response = await getSupportResponse('How do I play chess?');
        expect(response).toBe("I'm sorry, I couldn't process that right now.");
    });
});

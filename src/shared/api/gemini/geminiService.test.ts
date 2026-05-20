import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import { getSupportResponse } from './geminiService';

vi.mock('@google/genai', () => {
    const generateContentMock = vi.fn();
    return {
        GoogleGenAI: class {
            models = {
                generateContent: generateContentMock
            };
        }
    };
});

describe('getSupportResponse', () => {
    const originalEnv = process.env;
    let mockGenerateContent: any;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv, API_KEY: 'test-api-key' };

        const googleGenAIInstance = new GoogleGenAI({ apiKey: 'test-api-key' });
        mockGenerateContent = googleGenAIInstance.models.generateContent;
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.clearAllMocks();
    });

    it('should return the AI response text on success', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: 'This is a test support response.'
        });

        const response = await getSupportResponse('Test question');

        expect(mockGenerateContent).toHaveBeenCalledWith({
            model: 'gemini-1.5-flash',
            contents: expect.stringContaining('Test question')
        });
        expect(response).toBe('This is a test support response.');
    });

    it('should return a fallback message if response text is missing', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: null
        });

        const response = await getSupportResponse('Test question');

        expect(response).toBe("I'm sorry, I couldn't process that right now.");
    });

    it('should return a busy message if the API call throws an error', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

        // Mock console.error to avoid test output noise
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const response = await getSupportResponse('Test question');

        expect(response).toBe("Sorry, our support systems are currently busy. Please try again later.");

        consoleSpy.mockRestore();
    });
});
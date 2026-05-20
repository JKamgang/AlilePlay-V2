import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { moderateChatMessage } from './geminiService';

const mockGenerateContent = vi.fn();

// Mock the module
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent,
            };
            constructor() {}
        },
    };
});

describe('geminiService - moderateChatMessage', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup API_KEY for getAiClient
        originalEnv = process.env;
        process.env = { ...originalEnv, API_KEY: 'test-api-key' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('returns isAggressive true when model returns yes', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: 'yes'
        });

        const result = await moderateChatMessage('You are an idiot!');
        expect(result).toEqual({ isAggressive: true });

        expect(mockGenerateContent).toHaveBeenCalledWith({
            model: 'gemini-1.5-flash',
            contents: `Is the following message aggressive, hateful, bullying, or highly inappropriate? Answer with only "yes" or "no".\n\nMessage: "You are an idiot!"`,
        });
    });

    it('returns isAggressive false when model returns no', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: 'no'
        });

        const result = await moderateChatMessage('Hello world!');
        expect(result).toEqual({ isAggressive: false });
    });

    it('returns isAggressive false when model returns empty response', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: ''
        });

        const result = await moderateChatMessage('Test message');
        expect(result).toEqual({ isAggressive: false });
    });

    it('returns isAggressive false when API call throws an error', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

        // Spy on console.error to keep the test output clean
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await moderateChatMessage('Test message');
        expect(result).toEqual({ isAggressive: false });

        consoleSpy.mockRestore();
    });
});

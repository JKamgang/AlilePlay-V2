import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiRouter, AIRequestContext } from './aiRouter';

// Mock the GoogleGenAI client properly
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            }
        }
    }
});

describe('aiRouter', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        // Clear process.env variables
        process.env = { ...originalEnv };
        delete process.env.GEMINI_API_KEY;
        delete process.env.API_KEY;

        // Reset fetch mock
        global.fetch = vi.fn();
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetAllMocks();
    });

    it('should handle errors in premium tasks', async () => {
        // Mock API key so it tries to call actual client
        process.env.GEMINI_API_KEY = 'real-key';

        const context: AIRequestContext = {
            userTier: 'pro',
            taskType: 'complex',
            prompt: 'Test prompt'
        };

        // Make the generateContent call throw an error
        mockGenerateContent.mockRejectedValueOnce(new Error('Test Gemini Error'));

        // Spy on console.error to verify it's called
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const response = await aiRouter.generateContent(context);

        expect(response).toBe('Premium AI service temporarily unavailable.');
        expect(consoleSpy).toHaveBeenCalledWith('Gemini Error:', expect.any(Error));

        consoleSpy.mockRestore();
    });

    it('should return mock response when API key is missing or set to mock', async () => {
        // missing API key
        delete process.env.GEMINI_API_KEY;
        delete process.env.API_KEY;
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const context: AIRequestContext = {
            userTier: 'pro',
            taskType: 'complex',
            prompt: 'A long prompt string that needs to be truncated for the mock response.'
        };

        const response = await aiRouter.generateContent(context);
        expect(response).toContain('Mock Premium AI Response: A long prompt string that');
        expect(mockGenerateContent).not.toHaveBeenCalled();
        consoleSpy.mockRestore();

        // API key set to 'mock'
        process.env.GEMINI_API_KEY = 'mock';
        const response2 = await aiRouter.generateContent(context);
        expect(response2).toContain('Mock Premium AI Response: A long prompt string that');
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should return basic AI response via Groq', async () => {
        const context: AIRequestContext = {
            userTier: 'free',
            taskType: 'basic',
            prompt: 'Test prompt'
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ content: 'Groq response' })
        });

        const response = await aiRouter.generateContent(context);
        expect(response).toBe('Groq response');
        expect(global.fetch).toHaveBeenCalledWith('/api/groq', expect.any(Object));
    });

    it('should handle errors in basic tasks', async () => {
        const context: AIRequestContext = {
            userTier: 'free',
            taskType: 'basic',
            prompt: 'Test prompt'
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const response = await aiRouter.generateContent(context);
        expect(response).toBe('Basic AI service temporarily unavailable.');
        expect(consoleSpy).toHaveBeenCalledWith('Groq Backend Fetch Error:', expect.any(Error));
        expect(consoleSpy.mock.calls[0][1].message).toBe('HTTP error! status: 500');

        consoleSpy.mockRestore();
    });

    it('should deny vision task for non-enterprise users', async () => {
        const context: AIRequestContext = {
            userTier: 'pro',
            taskType: 'vision',
            prompt: 'Test vision'
        };

        await expect(aiRouter.generateContent(context)).rejects.toThrow('Access Denied: Computer Vision tasks require the Enterprise tier.');
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiRouter, AIRequestContext } from './aiRouter';
import { GoogleGenAI } from '@google/genai';

// Mock the getGeminiClient
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(() => ({
            models: {
                generateContent: vi.fn(),
            }
        }))
    };
});

describe('aiRouter', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.resetAllMocks();
    originalEnv = process.env;
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key' };

    // reset global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
      process.env = originalEnv;
  });

  describe('generateContent', () => {
    it('should handle fetch errors and return fallback message for basic tasks', async () => {
        const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
        global.fetch = mockFetch;

        const context: AIRequestContext = {
            userTier: 'free',
            taskType: 'basic',
            prompt: 'Test prompt'
        };

        const response = await aiRouter.generateContent(context);

        expect(response).toBe('Basic AI service temporarily unavailable.');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle HTTP errors and return fallback message for basic tasks', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        global.fetch = mockFetch as any;

        const context: AIRequestContext = {
            userTier: 'free',
            taskType: 'basic',
            prompt: 'Test prompt'
        };

        const response = await aiRouter.generateContent(context);

        expect(response).toBe('Basic AI service temporarily unavailable.');
    });

    it('should handle API errors and return fallback message for premium tasks', async () => {
        const mockGenerateContent = vi.fn().mockRejectedValue(new Error('API Error'));
        const MockedGenAI = vi.mocked(GoogleGenAI);

        // This simulates a class constructor, using function syntax, that returns the mocked structure.
        MockedGenAI.mockImplementation(function() {
            return {
                models: { generateContent: mockGenerateContent }
            } as any;
        } as any);

        const context: AIRequestContext = {
            userTier: 'pro',
            taskType: 'complex',
            prompt: 'Test prompt'
        };

        const response = await aiRouter.generateContent(context);

        expect(response).toBe('Premium AI service temporarily unavailable.');
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });
  });
});

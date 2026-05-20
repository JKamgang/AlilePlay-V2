import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiRouter } from './aiRouter';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Mock Gemini API Error'))
        }
      };
    })
  };
});

describe('aiRouter', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';

    // Mock global fetch for basic tasks
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('generateContent', () => {
    it('should catch fetch errors for basic tasks and return unavailability message', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch = vi.fn().mockRejectedValue(new Error('Mock Fetch Error'));

      const result = await aiRouter.generateContent({
        userTier: 'free',
        taskType: 'basic',
        prompt: 'test prompt'
      });

      expect(result).toBe('Basic AI service temporarily unavailable.');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Groq Backend Fetch Error:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should catch non-ok responses for basic tasks and return unavailability message', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        const result = await aiRouter.generateContent({
          userTier: 'free',
          taskType: 'basic',
          prompt: 'test prompt'
        });

        expect(result).toBe('Basic AI service temporarily unavailable.');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Groq Backend Fetch Error:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });

    it('should catch Gemini API errors for premium tasks and return unavailability message', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await aiRouter.generateContent({
        userTier: 'pro',
        taskType: 'complex',
        prompt: 'test prompt'
      });

      expect(result).toBe('Premium AI service temporarily unavailable.');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Gemini Error:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});

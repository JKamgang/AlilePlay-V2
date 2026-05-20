import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moderateChatMessage } from './geminiService';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Mock Gemini API Error'))
        }
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      INTEGER: 'INTEGER'
    }
  };
});

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = 'test-api-key';
  });

  describe('moderateChatMessage', () => {
    it('should catch API errors and return { isAggressive: false }', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await moderateChatMessage('test message');

      expect(result).toEqual({ isAggressive: false });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error moderating chat message:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});

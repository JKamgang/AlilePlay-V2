import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { moderateChatMessage } from './geminiService';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(function() {
            return {
                models: {
                    generateContent: mockGenerateContent,
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

describe('geminiService', () => {
    let originalEnvApiKey: string | undefined;

    beforeEach(() => {
        vi.clearAllMocks();
        originalEnvApiKey = process.env.API_KEY;
        process.env.API_KEY = 'test_api_key';
    });

    afterEach(() => {
        process.env.API_KEY = originalEnvApiKey;
    });

    describe('moderateChatMessage', () => {
        it('should return { isAggressive: true } when the API returns "yes"', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'yes' });
            const result = await moderateChatMessage('you are terrible');
            expect(result).toEqual({ isAggressive: true });
        });

        it('should return { isAggressive: false } when the API returns "no"', async () => {
            mockGenerateContent.mockResolvedValue({ text: 'no' });
            const result = await moderateChatMessage('hello friend');
            expect(result).toEqual({ isAggressive: false });
        });

        it('should return { isAggressive: false } when the API throws an error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockGenerateContent.mockRejectedValue(new Error('Mock API Error'));

            const result = await moderateChatMessage('hello');

            expect(result).toEqual({ isAggressive: false });
            expect(consoleSpy).toHaveBeenCalledWith("Error moderating chat message:", expect.any(Error));

            consoleSpy.mockRestore();
        });
    });
});

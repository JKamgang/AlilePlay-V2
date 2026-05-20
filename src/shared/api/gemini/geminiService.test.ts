import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWordAnalysis } from './geminiService';
import { GoogleGenAI, Type } from '@google/genai';

// Mock the @google/genai library
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent,
            };
        },
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        },
    };
});

describe('geminiService - getWordAnalysis', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.API_KEY = 'test-api-key';
        // Reset the singleton genAI instance between tests
        // Since we cannot easily reset the variable inside the module without exposing it,
        // we'll at least reset the mock calls. The singleton will use the same mocked class instance.
    });

    it('returns null if word is empty', async () => {
        const result = await getWordAnalysis('', 'basic');
        expect(result).toBeNull();
    });

    it('requests basic detail level and parses response correctly', async () => {
        const mockResponse = {
            text: JSON.stringify({
                definition: 'A test definition',
                score: 10,
            })
        };
        mockGenerateContent.mockResolvedValue(mockResponse);

        const result = await getWordAnalysis('test', 'basic');

        expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gemini-1.5-flash',
            contents: expect.stringContaining('test'),
            config: expect.objectContaining({
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        definition: { type: Type.STRING },
                        score: { type: Type.INTEGER },
                    }
                }
            })
        }));

        expect(result).toEqual({
            definition: 'A test definition',
            score: 10,
        });
    });

    it('requests full detail level and parses response correctly', async () => {
        const mockResponse = {
            text: JSON.stringify({
                definition: 'A test definition',
                synonyms: ['exam', 'trial'],
                antonyms: ['guess'],
                example: 'This is a test.',
                etymology: 'From Latin testis',
                score: 15,
            })
        };
        mockGenerateContent.mockResolvedValue(mockResponse);

        const result = await getWordAnalysis('test', 'full');

        expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gemini-1.5-flash',
            contents: expect.stringContaining('test'),
            config: expect.objectContaining({
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        definition: { type: Type.STRING },
                        synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                        antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                        example: { type: Type.STRING },
                        etymology: { type: Type.STRING },
                        score: { type: Type.INTEGER },
                    }
                }
            })
        }));

        expect(result).toEqual({
            definition: 'A test definition',
            synonyms: ['exam', 'trial'],
            antonyms: ['guess'],
            example: 'This is a test.',
            etymology: 'From Latin testis',
            score: 15,
        });
    });

    it('handles JSON parsing errors or empty responses gracefully', async () => {
        const mockResponse = {
            text: '' // This will default to '{}' then fail parsing or return {}
        };
        mockGenerateContent.mockResolvedValue(mockResponse);

        const result = await getWordAnalysis('test', 'basic');

        expect(result).toEqual({});
    });

    it('catches and handles API errors', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API rate limit exceeded'));

        const result = await getWordAnalysis('test', 'basic');

        expect(result).toEqual({
            definition: 'Sorry, there was an error analyzing this word.'
        });
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSupportResponse } from './geminiService';

const mockGenerateContent = vi.fn();

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class MockGoogleGenAI {
            models: any;
            constructor() {
                this.models = {
                    generateContent: mockGenerateContent
                };
            }
        },
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

        // Reset the environment variable
        process.env.API_KEY = 'test-api-key';
    });

    afterEach(() => {
        delete process.env.API_KEY;
    });

    it('should return the generated text when the AI responds successfully', async () => {
        const expectedResponse = "Alileva offers Chess, Word Master, Checkers, and Monopoly.";
        mockGenerateContent.mockResolvedValueOnce({
            text: expectedResponse
        });

        const response = await getSupportResponse("What games do you offer?");

        expect(response).toBe(expectedResponse);
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        expect(mockGenerateContent).toHaveBeenCalledWith({
            model: 'gemini-1.5-flash',
            contents: expect.stringContaining('What games do you offer?'),
        });
    });

    it('should return a fallback message if the AI response text is empty/falsy', async () => {
        mockGenerateContent.mockResolvedValueOnce({
            text: ''
        });

        const response = await getSupportResponse("Tell me a secret.");

        expect(response).toBe("I'm sorry, I couldn't process that right now.");
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('should catch errors and return a busy message', async () => {
        // Suppress console.error for this expected error test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

        const response = await getSupportResponse("Help me!");

        expect(response).toBe("Sorry, our support systems are currently busy. Please try again later.");
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });
});

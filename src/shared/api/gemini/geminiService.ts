// @google/genai Coding Guidelines: All usages of the Gemini API have been updated to adhere to the latest SDK best practices.
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_ANALYTICS_DATA } from '@/shared/constants';
import { WordAnalysis } from '@/shared/types';

let genAI: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (!genAI) {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set!");
            throw new Error("API_KEY environment variable not set!");
        }
        genAI = new GoogleGenAI({apiKey: process.env.API_KEY});
    }
    return genAI;
}

export const getMockAnalytics = (): Promise<any[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ANALYTICS_DATA), 500));
};

export const moderateChatMessage = async (message: string): Promise<{ isAggressive: boolean }> => {
    try {
        const ai = getAiClient();
        const prompt = `Is the following message aggressive, hateful, bullying, or highly inappropriate? Answer with only "yes" or "no".\n\nMessage: "${message}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        const text = response.text?.trim().toLowerCase() || 'no';
        return { isAggressive: text.includes('yes') };
    } catch (error) {
        console.error("Error moderating chat message:", error);
        return { isAggressive: false };
    }
};

export const getSupportResponse = async (question: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `You are the Alileva Global Gaming Platform Assistant. Answer the following user question politely. If asked about the platform, explain that it offers Chess, Word Master, Checkers, and Monopoly. User question: "${question}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "I'm sorry, I couldn't process that right now.";
    } catch (error) {
        console.error("Error getting support response:", error);
        return "Sorry, our support systems are currently busy. Please try again later.";
    }
};

export const getWordAnalysis = async (word: string, detailLevel: 'basic' | 'full'): Promise<WordAnalysis | null> => {
    if (!word) return null;

    const ai = getAiClient();

    const fullSchema = {
        type: Type.OBJECT,
        properties: {
            definition: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            example: { type: Type.STRING },
            etymology: { type: Type.STRING },
            score: { type: Type.INTEGER },
        }
    };

    const basicSchema = {
        type: Type.OBJECT,
        properties: {
            definition: { type: Type.STRING },
            score: { type: Type.INTEGER },
        }
    };

    const prompt = `Provide a detailed analysis for the word "${word}". Also provide a reasonable point score as if it were a Scrabble word.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
                responseSchema: detailLevel === 'full' ? fullSchema : basicSchema,
            }
        });

        const jsonText = response.text?.trim() || '{}';
        return JSON.parse(jsonText) as WordAnalysis;

    } catch (error) {
        console.error("Error getting word analysis:", error);
        return { definition: 'Sorry, there was an error analyzing this word.' };
    }
};

export const suggestBestWord = async (tiles: string[]): Promise<{ word: string, points: number } | null> => {
    if (tiles.length === 0) return null;

    const ai = getAiClient();
    const prompt = `Given the following Scrabble tiles, what is the highest-scoring word that can be formed? The tiles are: ${tiles.join(', ')}. Provide the word and its calculated score.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            word: { type: Type.STRING },
            points: { type: Type.INTEGER },
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text?.trim() || '{}';
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error suggesting best word:", error);
        return null;
    }
};
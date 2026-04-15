import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Initialize AI clients
let geminiClient: GoogleGenAI | null = null;
let groqClient: Groq | null = null;

function getGeminiClient(): GoogleGenAI {
    if (!geminiClient) {
        if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
            console.warn("GEMINI_API_KEY environment variable not set, using mock.");
        }
        geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || 'mock' });
    }
    return geminiClient;
}

function getGroqClient(): Groq {
    if (!groqClient) {
        if (!process.env.GROQ_API_KEY) {
            console.warn("GROQ_API_KEY environment variable not set, using mock.");
        }
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY || 'mock', dangerouslyAllowBrowser: true });
    }
    return groqClient;
}

export type UserTier = 'free' | 'preview' | 'plan-a' | 'plan-b' | 'plan-c' | 'pro' | 'enterprise';

export interface AIRequestContext {
    userTier: UserTier;
    taskType: 'basic' | 'complex' | 'vision' | 'voice';
    prompt: string;
    systemPrompt?: string;
    imageParts?: Array<{ inlineData: { data: string; mimeType: string } }>;
}

export const aiRouter = {
    async generateContent(context: AIRequestContext): Promise<string> {
        const { userTier, taskType, prompt, systemPrompt, imageParts } = context;

        // Routing Logic
        const usePremium = ['plan-a', 'plan-b', 'plan-c', 'pro', 'enterprise'].includes(userTier);

        if (taskType === 'vision' && userTier !== 'enterprise') {
            throw new Error("Access Denied: Computer Vision tasks require the Enterprise tier.");
        }

        // Premium tasks require Gemini 1.5 Pro
        if (taskType === 'complex' || taskType === 'vision' || usePremium) {
            try {
                const ai = getGeminiClient();
                const model = taskType === 'vision' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';

                const requestContents = imageParts && imageParts.length > 0
                    ? [{ text: prompt }, ...imageParts]
                    : prompt;

                if (process.env.GEMINI_API_KEY === 'mock' || !process.env.GEMINI_API_KEY) {
                   return "Mock Premium AI Response: " + prompt.substring(0, 50) + "...";
                }

                const response = await ai.models.generateContent({
                    model: model,
                    contents: requestContents as string,
                });
                return response.text || "";
            } catch (error) {
                console.error("Gemini Error:", error);
                return "Premium AI service temporarily unavailable.";
            }
        } else {
            // Basic tasks use Groq (Gemma 2) for speed and cost efficiency
            try {
                const groq = getGroqClient();

                if (process.env.GROQ_API_KEY === 'mock' || !process.env.GROQ_API_KEY) {
                   return "Mock Basic AI Response: " + prompt.substring(0, 50) + "...";
                }

                const messages: any[] = [];
                if (systemPrompt) {
                    messages.push({ role: 'system', content: systemPrompt });
                }
                messages.push({ role: 'user', content: prompt });

                const completion = await groq.chat.completions.create({
                    messages,
                    model: "gemma2-9b-it",
                });
                return completion.choices[0]?.message?.content || "";
            } catch (error) {
                console.error("Groq Error:", error);
                return "Basic AI service temporarily unavailable.";
            }
        }
    }
};

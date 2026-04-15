import { GoogleGenAI } from "@google/genai";

// Initialize AI clients
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
    if (!geminiClient) {
        if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) {
            console.warn("GEMINI_API_KEY environment variable not set, using mock.");
            // mock for now
        }
        geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || 'mock' });
    }
    return geminiClient;
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
            // Basic tasks use Groq (Gemma 2) via backend for speed and cost efficiency
            try {
                const messages: any[] = [{ role: 'user', content: prompt }];

                const response = await fetch('/api/groq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages,
                        systemPrompt
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.content || "";
            } catch (error) {
                console.error("Groq Backend Fetch Error:", error);
                return "Basic AI service temporarily unavailable.";
            }
        }
    }
};

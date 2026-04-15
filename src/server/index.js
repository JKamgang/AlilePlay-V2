import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env files
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'mock'
});

app.post('/api/groq', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const groqMessages = [];
    if (systemPrompt) {
        groqMessages.push({ role: 'system', content: systemPrompt });
    }
    if (Array.isArray(messages)) {
        groqMessages.push(...messages);
    }

    if (process.env.GROQ_API_KEY === 'mock' || !process.env.GROQ_API_KEY) {
        const promptPreview = messages?.[0]?.content?.substring(0, 50) || '';
        return res.json({ content: "Mock Basic AI Response: " + promptPreview + "..." });
    }

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "gemma2-9b-it",
    });

    res.json({ content: completion.choices[0]?.message?.content || "" });
  } catch (error) {
    console.error("Groq Backend Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

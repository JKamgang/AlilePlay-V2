import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from './index.js';

describe('API Routes', () => {
  describe('GET /api/hello', () => {
    it('should return a 200 status and correct JSON response', async () => {
      const response = await request(app).get('/api/hello');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Hello World!' });
    });
  });

  describe('POST /api/groq', () => {
    // Save original env before tests and restore after
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
      process.env.GROQ_API_KEY = 'mock'; // explicitly set mock for these tests
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return a mock response when API key is mock', async () => {
      const testMessages = [{ role: 'user', content: 'What is the meaning of life?' }];

      const response = await request(app)
        .post('/api/groq')
        .send({ messages: testMessages })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.content).toContain('Mock Basic AI Response: What is the meaning of life?...');
    });

    it('should include system prompt in the mocked interaction (if it were real)', async () => {
      const testMessages = [{ role: 'user', content: 'Tell me a joke.' }];
      const systemPrompt = 'You are a funny comedian.';

      const response = await request(app)
        .post('/api/groq')
        .send({ messages: testMessages, systemPrompt })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.content).toContain('Mock Basic AI Response: Tell me a joke....');
    });

    it('should handle empty messages gracefully', async () => {
      const response = await request(app)
        .post('/api/groq')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.content).toContain('Mock Basic AI Response: ...');
    });
  });
});

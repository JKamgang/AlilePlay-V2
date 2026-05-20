import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './index.js';

describe('API Routes', () => {
  describe('GET /api/hello', () => {
    it('should return 200 and the correct greeting message', async () => {
      const response = await request(app).get('/api/hello');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Hello from Alileva Backend',
      });
    });
  });

  describe('POST /api/groq (mock)', () => {
    it('should handle mock groq requests when API key is missing', async () => {
      const response = await request(app)
        .post('/api/groq')
        .send({
          messages: [{ role: 'user', content: 'hello world' }],
          systemPrompt: 'You are an AI'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content');
      expect(response.body.content).toMatch(/Mock Basic AI Response/);
    });
  });
});

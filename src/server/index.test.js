import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import Groq from 'groq-sdk';
import app from './index.js';

// Mock groq-sdk
vi.mock('groq-sdk', () => {
  const mockCreate = vi.fn();
  const GroqMock = class {
    constructor() {
      this.chat = {
        completions: {
          create: mockCreate,
        },
      };
    }
  };
  return { default: GroqMock };
});

describe('Groq API Backend', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.GROQ_API_KEY;
    // Set API key to bypass mock response logic in route
    process.env.GROQ_API_KEY = 'real-api-key';
  });

  afterEach(() => {
    process.env.GROQ_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return 500 when groq completion throws an error', async () => {
    const instance = new Groq();
    const mockCreate = instance.chat.completions.create;

    mockCreate.mockRejectedValueOnce(new Error('Simulated Groq Error'));

    const response = await request(app)
      .post('/api/groq')
      .send({ messages: [{ role: 'user', content: 'hello' }] });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});

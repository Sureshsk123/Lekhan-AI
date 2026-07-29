import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/mongodb.js';

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'jest_test_secret_key_32chars_long!';
  process.env.NODE_ENV = 'test';

  await connectDB();
  const mod = await import('../server.js');
  app = mod.default;

  const signupRes = await request(app).post('/api/auth/signup').send({
    username: 'tutortester',
    email: 'tutortester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Gemini AI Tutor Integration Tests', () => {
  let sessionId;

  test('POST /api/ai-tutor/session — creates a new chat session', async () => {
    const res = await request(app)
      .post('/api/ai-tutor/session')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tamil Vowels Practice',
        language: 'Tamil',
        ageGroup: 'adult',
        difficulty: 'Medium'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    sessionId = res.body.data._id;
  });

  test('GET /api/ai-tutor/session — lists user chat sessions', async () => {
    const res = await request(app)
      .get('/api/ai-tutor/session')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/ai-tutor/chat — asks AI Tutor a question with session context', async () => {
    const res = await request(app)
      .post('/api/ai-tutor/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Explain Tamil vowels with examples.',
        sessionId,
        language: 'Tamil',
        ageGroup: 'adult',
        difficulty: 'Medium'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('reply');
    expect(res.body.data).toHaveProperty('aiMessage');
  });

  test('GET /api/ai-tutor/history/:sessionId — fetches chat history', async () => {
    const res = await request(app)
      .get(`/api/ai-tutor/history/${sessionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('DELETE /api/ai-tutor/clear/:sessionId — clears chat session', async () => {
    const res = await request(app)
      .delete(`/api/ai-tutor/clear/${sessionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

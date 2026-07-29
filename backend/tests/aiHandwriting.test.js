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
    username: 'handwritingtester',
    email: 'handwritingtester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Handwriting Evaluation Integration Tests', () => {
  test('POST /api/handwriting/evaluate — evaluates canvas strokes', async () => {
    const res = await request(app)
      .post('/api/handwriting/evaluate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        targetChar: 'அ',
        language: 'Tamil',
        inputType: 'canvas',
        strokes: [{ x: 10, y: 20 }, { x: 30, y: 40 }]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('formation');
    expect(res.body.data).toHaveProperty('spacing');
    expect(res.body.data).toHaveProperty('consistency');
    expect(res.body.data).toHaveProperty('mistakes');
    expect(res.body.data).toHaveProperty('tips');
  });

  test('GET /api/handwriting/history — fetches evaluation history', async () => {
    const res = await request(app)
      .get('/api/handwriting/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/handwriting/progress-graph — retrieves historical progress data', async () => {
    const res = await request(app)
      .get('/api/handwriting/progress-graph')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

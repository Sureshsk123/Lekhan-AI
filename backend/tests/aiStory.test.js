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
    username: 'storygenTester',
    email: 'storygentester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('AI Story Generator Integration Tests', () => {
  test('POST /api/stories/generate — generates custom story', async () => {
    const res = await request(app)
      .post('/api/stories/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'Tamil',
        difficulty: 'Medium',
        age: 'kids',
        topic: 'Folk Tales',
        length: 'short'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title');
    expect(res.body.data).toHaveProperty('story');
    expect(res.body.data).toHaveProperty('translation');
    expect(res.body.data).toHaveProperty('vocabulary');
    expect(res.body.data).toHaveProperty('moral');
    expect(res.body.data).toHaveProperty('readingQuestions');
    expect(res.body.data).toHaveProperty('speakingPractice');
  });

  test('GET /api/stories/my-generated — lists user generated stories', async () => {
    const res = await request(app)
      .get('/api/stories/my-generated')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

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
    username: 'aiquiztester',
    email: 'aiquiztester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Dynamic AI Quiz Generator Integration Tests', () => {
  test('POST /api/quiz/ai-generate — generates dynamic quiz questions', async () => {
    const res = await request(app)
      .post('/api/quiz/ai-generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topic: 'Tamil Vowels',
        language: 'Tamil',
        difficulty: 'Medium',
        totalQuestions: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('quizTitle');
    expect(res.body.data).toHaveProperty('questions');
    expect(Array.isArray(res.body.data.questions)).toBe(true);
  });

  test('POST /api/quiz/ai-submit — submits and auto-scores dynamic quiz', async () => {
    const res = await request(app)
      .post('/api/quiz/ai-submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        quizTitle: 'Tamil Vowels Quiz',
        language: 'Tamil',
        userAnswers: [
          { questionId: 1, selectedAnswer: 'அ (A)', correctAnswer: 'அ (A)', isCorrect: true },
          { questionId: 2, selectedAnswer: 'kam', correctAnswer: 'kam', isCorrect: true }
        ],
        totalQuestions: 2,
        timeSpent: 45
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('xpEarned');
    expect(res.body.data).toHaveProperty('newStats');
  });
});

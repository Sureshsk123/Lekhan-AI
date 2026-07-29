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
    username: 'ocrtester',
    email: 'ocrtester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Gemini Vision OCR Integration Tests', () => {
  test('POST /api/ocr/vision — processes vision OCR using base64 image data', async () => {
    const fakeBase64 = Buffer.from('fake image content').toString('base64');
    const res = await request(app)
      .post('/api/ocr/vision')
      .set('Authorization', `Bearer ${token}`)
      .send({
        imageBase64: fakeBase64,
        fileType: 'png',
        language: 'Tamil'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('extractedText');
    expect(res.body.data).toHaveProperty('confidence');
    expect(res.body.data).toHaveProperty('detectedLanguage');
    expect(res.body.data).toHaveProperty('mistakes');
    expect(res.body.data).toHaveProperty('suggestions');
  });

  test('GET /api/ocr/history — retrieves saved OCR history', async () => {
    const res = await request(app)
      .get('/api/ocr/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

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
    username: 'speechtester',
    email: 'speechtester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Speech-to-Text & Text-to-Speech Integration Tests', () => {
  test('POST /api/stt/transcribe — transcribes speech and evaluates pronunciation', async () => {
    const fakeAudioBase64 = Buffer.from('fake audio data').toString('base64');
    const res = await request(app)
      .post('/api/stt/transcribe')
      .set('Authorization', `Bearer ${token}`)
      .send({
        audioBase64: fakeAudioBase64,
        language: 'Tamil',
        expectedText: 'Vanakkam'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('transcription');
    expect(res.body.data).toHaveProperty('pronunciationScore');
    expect(res.body.data).toHaveProperty('detectedMistakes');
    expect(res.body.data).toHaveProperty('accentFeedback');
  });

  test('GET /api/stt/history — fetches speech history', async () => {
    const res = await request(app)
      .get('/api/stt/history')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/tts/generate — synthesizes text to speech configuration', async () => {
    const res = await request(app)
      .post('/api/tts/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'வணக்கம், ஆன்லைன் தமிழ் கற்றலுக்கு வரவேற்கிறோம்',
        language: 'Tamil',
        voiceStyle: 'teacher',
        speed: 1.0
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('ssml');
    expect(res.body.data).toHaveProperty('audioConfig');
  });
});

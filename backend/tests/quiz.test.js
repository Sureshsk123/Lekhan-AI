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
        username: 'quiztester',
        email: 'quiztester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Quiz Module Integration Tests', () => {
    test('POST /api/quiz/generate/:lessonId — generates quiz questions', async () => {
        const lessonRes = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                level: 'words',
                title: 'Quiz Test Lesson',
                vocabulary: [{ word: 'அம்மா', translation: 'Mother' }]
            });

        const lessonId = lessonRes.body.data.lesson._id;

        const res = await request(app)
            .post(`/api/quiz/generate/${lessonId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/quiz/submit — submits quiz attempt and updates user stats', async () => {
        const res = await request(app)
            .post('/api/quiz/submit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                lessonId: 'l-tamil-1',
                score: 5,
                totalQuestions: 5,
                timeSpent: 60,
                accuracy: 100
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

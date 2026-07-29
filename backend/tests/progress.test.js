import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/mongodb.js';

let mongoServer;
let app;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.JWT_SECRET = 'jest_test_secret_key_32chars_long!';
    process.env.NODE_ENV = 'test';

    await connectDB();
    const mod = await import('../server.js');
    app = mod.default;

    const signupRes = await request(app).post('/api/auth/signup').send({
        username: 'progresstester',
        email: 'progresstester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
    userId = signupRes.body.data ? signupRes.body.data.user._id : signupRes.body.user._id;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Progress Module Integration Tests', () => {
    test('GET /api/progress/tamil — gets or initializes progress', async () => {
        const res = await request(app)
            .get('/api/progress/tamil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/progress/lesson — updates lesson completion', async () => {
        const res = await request(app)
            .post('/api/progress/lesson')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                lessonId: 'l-tamil-1',
                score: 100,
                accuracy: 95,
                timeSpent: 120,
                xpEarned: 50
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/progress/word — records learned word', async () => {
        const res = await request(app)
            .post('/api/progress/word')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                word: 'அம்மா',
                translation: 'Mother',
                proficiency: 80
            });

        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/progress/skills — updates skill levels', async () => {
        const res = await request(app)
            .put('/api/progress/skills')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                skillLevels: { vocabulary: 75, reading: 85 }
            });

        expect(res.statusCode).toBe(200);
    });

    test('GET /api/progress/analytics/:userId — returns parent analytics', async () => {
        const res = await request(app)
            .get(`/api/progress/analytics/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

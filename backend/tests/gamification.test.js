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
        username: 'gamificationtester',
        email: 'gamificationtester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Gamification Module Integration Tests', () => {
    test('GET /api/gamification/achievements — gets catalog and user achievements', async () => {
        const res = await request(app)
            .get('/api/gamification/achievements')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/gamification/check — checks and awards achievements', async () => {
        const res = await request(app)
            .post('/api/gamification/check')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/gamification/xp-history — gets user XP transaction history', async () => {
        const res = await request(app)
            .get('/api/gamification/xp-history')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/gamification/leaderboard — gets global leaderboard', async () => {
        const res = await request(app)
            .get('/api/gamification/leaderboard')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});

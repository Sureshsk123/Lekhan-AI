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
        username: 'hwtester',
        email: 'hwtester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Handwriting Evaluation Integration Tests', () => {
    test('POST /api/handwriting/evaluate — evaluates handwriting strokes', async () => {
        const res = await request(app)
            .post('/api/handwriting/evaluate')
            .set('Authorization', `Bearer ${token}`)
            .send({
                targetChar: 'அ',
                language: 'tamil',
                strokes: [
                    { x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },
                    { x: 40, y: 40 }, { x: 50, y: 50 }, { x: 60, y: 60 },
                    { x: 70, y: 70 }, { x: 80, y: 80 }, { x: 90, y: 90 }, { x: 100, y: 100 }
                ]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

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
        username: 'usertester',
        email: 'usertester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('User Management Module Integration Tests', () => {
    test('GET /api/user/profile — returns profile', async () => {
        const res = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('PUT /api/user/profile — updates profile', async () => {
        const res = await request(app)
            .put('/api/user/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'updatedusername',
                avatar: 'avatar2.png'
            });

        expect(res.statusCode).toBe(200);
    });

    test('POST /api/user/xp — adds XP to user', async () => {
        const res = await request(app)
            .post('/api/user/xp')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 500 });

        expect(res.statusCode).toBe(200);
    });

    test('POST /api/user/diamonds — updates user diamonds', async () => {
        const res = await request(app)
            .post('/api/user/diamonds')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: 50 });

        expect(res.statusCode).toBe(200);
    });

    test('POST /api/user/achievement — adds achievement', async () => {
        const res = await request(app)
            .post('/api/user/achievement')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Custom Badge',
                icon: '🎖️',
                description: 'Custom test achievement'
            });

        expect(res.statusCode).toBe(200);
    });
});

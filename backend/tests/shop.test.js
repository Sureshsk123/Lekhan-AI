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
        username: 'shoptester',
        email: 'shoptester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Shop Module Integration Tests', () => {
    test('GET /api/shop/catalog — returns rewards catalog', async () => {
        const res = await request(app)
            .get('/api/shop/catalog')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/shop/purchase — purchases catalog item', async () => {
        const res = await request(app)
            .post('/api/shop/purchase')
            .set('Authorization', `Bearer ${token}`)
            .send({ itemId: 'emoji_pack_1' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/shop/inventory — gets user owned items', async () => {
        const res = await request(app)
            .get('/api/shop/inventory')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    test('POST /api/shop/equip — equips owned item', async () => {
        const res = await request(app)
            .post('/api/shop/equip')
            .set('Authorization', `Bearer ${token}`)
            .send({ itemId: 'emoji_pack_1' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

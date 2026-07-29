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
        username: 'lessontester',
        email: 'lessontester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Lessons Module Integration Tests', () => {
    test('GET /api/lessons/tamil — returns lessons for language', async () => {
        const res = await request(app)
            .get('/api/lessons/tamil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/lessons — returns paginated lessons', async () => {
        const res = await request(app)
            .get('/api/lessons?page=1&limit=5')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/lessons — creates a new lesson', async () => {
        const res = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                level: 'vowels',
                title: 'New Custom Lesson',
                description: 'Description of custom lesson',
                xpReward: 60,
                diamondReward: 15
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/lessons/tamil/:id — returns single lesson', async () => {
        const createRes = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                level: 'words',
                title: 'Single Lesson Test',
                description: 'Test single lesson'
            });

        const lessonId = createRes.body.data.lesson._id;

        const getRes = await request(app)
            .get(`/api/lessons/tamil/${lessonId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.success).toBe(true);
    });

    test('PUT /api/lessons/:id — updates lesson', async () => {
        const createRes = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'hindi',
                level: 'vowels',
                title: 'Lesson to Update'
            });

        const lessonId = createRes.body.data.lesson._id;

        const updateRes = await request(app)
            .put(`/api/lessons/${lessonId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Lesson Title' });

        expect(updateRes.statusCode).toBe(200);
    });

    test('DELETE /api/lessons/:id — soft deletes lesson', async () => {
        const createRes = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'kannada',
                level: 'alphabets',
                title: 'Lesson to Delete'
            });

        const lessonId = createRes.body.data.lesson._id;

        const deleteRes = await request(app)
            .delete(`/api/lessons/${lessonId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.statusCode).toBe(200);
    });

    test('POST /api/lessons/chat — returns AI tutor response', async () => {
        const res = await request(app)
            .post('/api/lessons/chat')
            .set('Authorization', `Bearer ${token}`)
            .send({
                message: 'How to say hello in tamil?',
                language: 'tamil'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.reply).toBeDefined();
    });
});

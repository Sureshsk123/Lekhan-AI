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
        username: 'storytester',
        email: 'storytester@example.com',
        password: 'Password123!'
    });
    token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Stories Module Integration Tests', () => {
    test('GET /api/stories/tamil — returns stories for language', async () => {
        const res = await request(app)
            .get('/api/stories/tamil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/stories — creates a new story', async () => {
        const res = await request(app)
            .post('/api/stories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                category: 'moral',
                title: 'The Lion and Mouse',
                content: 'Once upon a time...',
                translation: 'Translation content'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/stories/tamil/:id — gets single story and increments read count', async () => {
        const createRes = await request(app)
            .post('/api/stories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'tamil',
                category: 'short',
                title: 'Read Count Story',
                content: 'Content here'
            });

        const storyId = createRes.body.data.story._id;

        const getRes = await request(app)
            .get(`/api/stories/tamil/${storyId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.data.story.readCount).toBe(1);
    });

    test('POST /api/stories/:id/bookmark — toggles story bookmark', async () => {
        const createRes = await request(app)
            .post('/api/stories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                language: 'hindi',
                category: 'folk',
                title: 'Bookmark Story',
                content: 'Folk tale'
            });

        const storyId = createRes.body.data.story._id;

        const bookmarkRes = await request(app)
            .post(`/api/stories/${storyId}/bookmark`)
            .set('Authorization', `Bearer ${token}`);

        expect(bookmarkRes.statusCode).toBe(200);
        expect(bookmarkRes.body.success).toBe(true);
    });
});

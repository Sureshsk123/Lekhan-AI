/**
 * LangSphere Phase 1 — Integration Tests
 * Stack: Jest + Supertest + MongoMemoryServer
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/mongodb.js';

let mongoServer;
let app;

const ts = Date.now();
const testUser = {
    username: `testuser_${ts}`,
    email: `testuser_${ts}@example.com`,
    phone: '+919876543210',
    password: 'Password123!',
    gender: 'other',
    mode: 'student',
    enrolledLanguages: ['tamil']
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.JWT_SECRET = 'jest_test_secret_key_32chars_long!';
    process.env.JWT_EXPIRE = '1h';
    process.env.NODE_ENV = 'test';

    await connectDB();
    const mod = await import('../server.js');
    app = mod.default;
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
}, 15000);

let authToken = '';

describe('GET /api/health', () => {
    test('returns 200 with full health payload', async () => {
        const res = await request(app).get('/api/health');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.status).toBe('ok');
        expect(res.body.data.database).toBeDefined();
        expect(res.body.data.database.connected).toBe(true);
        expect(typeof res.body.data.uptime).toBe('number');
        expect(res.body.data.timestamp).toBeDefined();
        expect(res.body.data.environment).toBeDefined();
    });
});

describe('POST /api/auth/signup — Register', () => {
    test('201: registers a new user and returns token', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBeDefined();
        expect(res.body.data).toBeDefined();
        expect(res.body.data.token).toBeDefined();
        expect(typeof res.body.data.token).toBe('string');
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.user.email).toBe(testUser.email);
        expect(res.body.data.user.username).toBe(testUser.username);

        authToken = res.body.data.token;
    });

    test('password is never returned in register response', async () => {
        const user = {
            username: `pwtest_${ts}`,
            email: `pwtest_${ts}@example.com`,
            password: 'SecurePass1!'
        };
        const res = await request(app).post('/api/auth/signup').send(user);
        expect(res.statusCode).toBe(201);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain('SecurePass1!');
        expect(body).not.toContain('"password"');
    });

    test('409: rejects duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ ...testUser, username: `different_${ts}` });

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBe(true);
    });

    test('409: rejects duplicate username', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ ...testUser, email: `different_${ts}@example.com` });

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test('422: rejects invalid email format', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ username: 'validuser', email: 'not-an-email', password: 'password123' });

        expect(res.statusCode).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBe(true);
        const fields = res.body.errors.map(e => e.field);
        expect(fields).toContain('email');
    });

    test('422: rejects payload missing username, email, password', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({});

        expect(res.statusCode).toBe(422);
        expect(res.body.success).toBe(false);
        const fields = res.body.errors.map(e => e.field);
        expect(fields).toContain('username');
        expect(fields).toContain('email');
        expect(fields).toContain('password');
    });

    test('422: rejects username shorter than 3 chars', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ username: 'ab', email: 'ab@example.com', password: 'password123' });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors.map(e => e.field)).toContain('username');
    });

    test('422: rejects password shorter than 6 chars', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ username: 'validuser2', email: 'valid2@example.com', password: '123' });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors.map(e => e.field)).toContain('password');
    });

    test('422: rejects invalid gender value', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ username: `gendtest_${ts}`, email: `gendtest_${ts}@example.com`, password: 'pass123', gender: 'attack<script>' });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors.map(e => e.field)).toContain('gender');
    });
});

describe('POST /api/auth/login', () => {
    test('200: logs in with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.user.email).toBe(testUser.email);

        authToken = res.body.data.token;
    });

    test('password is never returned in login response', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toBe(200);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain(testUser.password);
        expect(body).not.toContain('"password"');
    });

    test('401: rejects wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: 'WrongPassword999' });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('401: rejects unknown email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'anypassword' });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('422: rejects invalid email on login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'bad-email', password: 'anypassword' });

        expect(res.statusCode).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.errors.map(e => e.field)).toContain('email');
    });

    test('422: rejects missing password on login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email });

        expect(res.statusCode).toBe(422);
        expect(res.body.errors.map(e => e.field)).toContain('password');
    });
});

describe('GET /api/auth/profile', () => {
    test('200: returns profile for authenticated user', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.user.email).toBe(testUser.email);
    });

    test('password is never returned in profile response', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain('"password"');
    });

    test('401: returns 401 when no token provided', async () => {
        const res = await request(app).get('/api/auth/profile');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('401: returns 401 for tampered JWT', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/auth/logout', () => {
    test('200: logs out authenticated user', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('Logged out');
    });

    test('401: returns 401 when no token provided for logout', async () => {
        const res = await request(app).post('/api/auth/logout');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('404 — Unknown Routes', () => {
    test('404: returns structured 404 for unknown GET route', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBeDefined();
    });

    test('404: returns structured 404 for unknown POST route', async () => {
        const res = await request(app)
            .post('/api/no-such-endpoint')
            .send({ foo: 'bar' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('API Response Shape Consistency', () => {
    test('success responses always have success:true and message', async () => {
        const res = await request(app).get('/api/health');
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
    });

    test('error responses always have success:false and errors array', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({});

        expect(res.body).toHaveProperty('success', false);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
    });
});

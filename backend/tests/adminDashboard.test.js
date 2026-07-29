import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/mongodb.js';
import User from '../models/User.js';

let mongoServer;
let app;
let adminToken;
let userToken;
let regularUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'jest_test_secret_key_32chars_long!';
  process.env.NODE_ENV = 'test';

  await connectDB();
  const mod = await import('../server.js');
  app = mod.default;

  // Create Admin account with role='admin'
  const adminRes = await request(app).post('/api/auth/signup').send({
    username: 'admintester',
    email: 'admintester@example.com',
    password: 'Password123!',
    role: 'admin'
  });
  adminToken = adminRes.body.data ? adminRes.body.data.token : adminRes.body.token;

  // Create regular user account
  const userRes = await request(app).post('/api/auth/signup').send({
    username: 'regularuser',
    email: 'regularuser@example.com',
    password: 'Password123!',
    role: 'user'
  });
  userToken = userRes.body.data ? userRes.body.data.token : userRes.body.token;
  regularUserId = userRes.body.data ? userRes.body.data.user._id : userRes.body.user._id;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Admin Dashboard & Role Management Integration Tests', () => {
  test('GET /api/admin/dashboard — fails with 403 if non-admin user accesses', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/admin/dashboard — fetches system overview metrics for admin', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalUsers');
    expect(res.body.data).toHaveProperty('totalLessons');
    expect(res.body.data).toHaveProperty('totalStories');
  });

  test('GET /api/admin/users — lists users for admin with search/filters', async () => {
    const res = await request(app)
      .get('/api/admin/users?page=1&limit=10&search=regular')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('PUT /api/admin/users/:userId/role — updates user role', async () => {
    const res = await request(app)
      .put(`/api/admin/users/${regularUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'parent' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('parent');
  });
});

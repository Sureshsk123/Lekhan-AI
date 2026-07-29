import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/mongodb.js';

let mongoServer;
let app;
let parentToken;
let childEmail = 'childlearner@example.com';
let childId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'jest_test_secret_key_32chars_long!';
  process.env.NODE_ENV = 'test';

  await connectDB();
  const mod = await import('../server.js');
  app = mod.default;

  // Create child account
  const childRes = await request(app).post('/api/auth/signup').send({
    username: 'childlearner',
    email: childEmail,
    password: 'Password123!'
  });
  childId = childRes.body.data ? childRes.body.data.user._id : childRes.body.user._id;

  // Create parent account
  const parentRes = await request(app).post('/api/auth/signup').send({
    username: 'parenttester',
    email: 'parenttester@example.com',
    password: 'Password123!',
    role: 'parent'
  });
  parentToken = parentRes.body.data ? parentRes.body.data.token : parentRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Parent Dashboard Integration Tests', () => {
  test('POST /api/parent/link-child — links child account to parent', async () => {
    const res = await request(app)
      .post('/api/parent/link-child')
      .set('Authorization', `Bearer ${parentToken}`)
      .send({
        childEmail,
        relationship: 'parent'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/parent/children — retrieves linked children list', async () => {
    const res = await request(app)
      .get('/api/parent/children')
      .set('Authorization', `Bearer ${parentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/parent/dashboard/:childId — fetches child detailed dashboard', async () => {
    const res = await request(app)
      .get(`/api/parent/dashboard/${childId}`)
      .set('Authorization', `Bearer ${parentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('child');
    expect(res.body.data).toHaveProperty('metrics');
    expect(res.body.data).toHaveProperty('recommendations');
  });
});

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
    username: 'notificationtester',
    email: 'notificationtester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Notifications System Integration Tests', () => {
  let notificationId;

  test('POST /api/notifications/remind-practice — triggers practice reminder', async () => {
    const res = await request(app)
      .post('/api/notifications/remind-practice')
      .set('Authorization', `Bearer ${token}`)
      .send({ language: 'Tamil' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    notificationId = res.body.data._id;
  });

  test('GET /api/notifications — retrieves user notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('PUT /api/notifications/:id/read — marks notification as read', async () => {
    const res = await request(app)
      .put(`/api/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.read).toBe(true);
  });

  test('PUT /api/notifications/read-all — marks all notifications as read', async () => {
    const res = await request(app)
      .put('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

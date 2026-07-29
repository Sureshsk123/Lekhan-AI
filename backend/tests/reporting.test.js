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
    username: 'reporttester',
    email: 'reporttester@example.com',
    password: 'Password123!'
  });
  token = signupRes.body.data ? signupRes.body.data.token : signupRes.body.token;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 15000);

describe('Automated Reporting & PDF Exporter Integration Tests', () => {
  let reportId;

  test('POST /api/reports/generate — generates weekly report', async () => {
    const res = await request(app)
      .post('/api/reports/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ reportType: 'weekly' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    reportId = res.body.data._id;
  });

  test('GET /api/reports/my-reports — fetches generated user reports', async () => {
    const res = await request(app)
      .get('/api/reports/my-reports')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/reports/export-pdf/:reportId — exports PDF report payload', async () => {
    const res = await request(app)
      .get(`/api/reports/export-pdf/${reportId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('downloadUrl');
    expect(res.body.data.format).toBe('application/pdf');
  });
});

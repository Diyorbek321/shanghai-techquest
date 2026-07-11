import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../index';
import { prisma } from '../db';

const app = createApp();
const testEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: '@vitest.local' } } });
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  it('creates a user and sets an auth cookie', async () => {
    const email = testEmail('register');
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password123', name: 'Test Student' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']?.[0]).toMatch(/techquest_token=/);
  });

  it('rejects a duplicate email', async () => {
    const email = testEmail('dup');
    await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'First' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password123', name: 'Second' });

    expect(res.status).toBe(409);
  });

  it('rejects an invalid payload', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'not-an-email', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const email = testEmail('login');
    await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'Login Test' });

    const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  it('rejects an incorrect password', async () => {
    const email = testEmail('badpw');
    await request(app).post('/api/auth/register').send({ email, password: 'password123', name: 'Bad PW' });

    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects an unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testEmail('unknown'), password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 without a session cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the current user with a valid session cookie', async () => {
    const email = testEmail('me');
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password123', name: 'Me Test' });
    const cookie = registerRes.headers['set-cookie'];

    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });
});

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(204);
    expect(res.headers['set-cookie']?.[0]).toMatch(/techquest_token=;/);
  });
});

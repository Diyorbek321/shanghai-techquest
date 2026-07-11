import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../index';
import { prisma } from '../db';

const app = createApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('auth rate limiting', () => {
  it('blocks login attempts after the limit is exceeded', async () => {
    const attempts = Array.from({ length: 11 }, (_, i) => i);
    const results: number[] = [];

    for (const _ of attempts) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@vitest.local', password: 'wrong' });
      results.push(res.status);
    }

    expect(results.slice(0, 10)).not.toContain(429);
    expect(results.at(-1)).toBe(429);
  }, 20_000);
});

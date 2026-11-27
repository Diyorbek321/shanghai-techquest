import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

const app = createApp();
let studentId: string;
let cookie: string;

beforeAll(async () => {
  const student = await prisma.user.create({
    data: {
      email: `self-reward-${Date.now()}@selfreward.vitest.test`,
      passwordHash: await bcrypt.hash('password123', 4),
      name: 'Self Reward Student',
      role: Role.STUDENT,
      xp: 0,
      coins: 0,
    },
  });
  studentId = student.id;
  cookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: student.id, role: student.role, track: student.track })}`;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: studentId } });
  await prisma.$disconnect();
});

describe('POST /api/users/me/reward', () => {
  it('no longer lets a student grant themselves XP or coins', async () => {
    const res = await request(app)
      .post('/api/users/me/reward')
      .set('Cookie', cookie)
      .send({ xp: 100000, coins: 100000 });

    // 403: the request now falls through to the teacher-only /:id/reward route.
    expect([403, 404]).toContain(res.status);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    expect(user.xp).toBe(0);
    expect(user.coins).toBe(0);
  });
});

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

vi.mock('../code/piston', async () => {
  const actual = await vi.importActual<typeof import('../code/piston')>('../code/piston');
  return { ...actual, executeCode: vi.fn() };
});

import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { executeCode, PistonUnavailableError } from '../code/piston';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@problemsrun.vitest.test`;

let studentId: string;
let studentCookie: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: { email: uniqueEmail('student'), passwordHash, name: 'Run Test Student', role: Role.STUDENT },
  });
  studentId = student.id;
  studentCookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: student.id, role: student.role, track: student.track })}`;
});

afterEach(() => {
  vi.mocked(executeCode).mockReset();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: studentId } });
  await prisma.$disconnect();
});

describe('POST /api/problems/run', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/problems/run').send({ code: '1', language: 'javascript' });
    expect(res.status).toBe(401);
  });

  it('rejects a request with no code', async () => {
    const res = await request(app).post('/api/problems/run').set('Cookie', studentCookie).send({ language: 'javascript' });
    expect(res.status).toBe(400);
  });

  it('rejects an unsupported language', async () => {
    const res = await request(app)
      .post('/api/problems/run')
      .set('Cookie', studentCookie)
      .send({ code: 'echo hi', language: 'bash' });
    expect(res.status).toBe(400);
  });

  it('returns the execution result on success', async () => {
    vi.mocked(executeCode).mockResolvedValue({ stdout: 'hi\n', stderr: '', compileOutput: null, timedOut: false });

    const res = await request(app)
      .post('/api/problems/run')
      .set('Cookie', studentCookie)
      .send({ code: 'console.log("hi")', language: 'javascript' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ stdout: 'hi\n', stderr: '', compileOutput: null, timedOut: false });
  });

  it('returns 503 when the execution sandbox is unavailable', async () => {
    vi.mocked(executeCode).mockRejectedValue(new PistonUnavailableError('Kod ishga tushirish xizmati mavjud emas.'));

    const res = await request(app)
      .post('/api/problems/run')
      .set('Cookie', studentCookie)
      .send({ code: '1', language: 'javascript' });

    expect(res.status).toBe(503);
    expect(res.body.error).toBe('Kod ishga tushirish xizmati mavjud emas.');
  });
});

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { UPLOAD_DIR } from '../uploads/storage';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  const token = signToken({ sub: userId, role, track });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

let studentId: string;
let studentCookie: string;
const uploadedFilenames: string[] = [];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const student = await prisma.user.create({
    data: { email: uniqueEmail('upload'), passwordHash, name: 'Upload Tester', role: Role.STUDENT, track: Track.OFFICE },
  });
  studentId = student.id;
  studentCookie = cookieFor(student.id, student.role, student.track);
});

afterAll(async () => {
  for (const name of uploadedFilenames) {
    const filePath = path.join(UPLOAD_DIR, name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  await prisma.user.deleteMany({ where: { id: studentId } });
  await prisma.$disconnect();
});

describe('POST /api/uploads', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .attach('file', Buffer.from('hi'), { filename: 'a.pdf', contentType: 'application/pdf' });
    expect(res.status).toBe(401);
  });

  it('accepts an allowed file type and returns a download url', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .set('Cookie', studentCookie)
      .attach('file', Buffer.from('%PDF-1.4 test'), { filename: 'homework.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(201);
    expect(res.body.fileName).toBe('homework.pdf');
    expect(res.body.url).toMatch(/^\/api\/uploads\//);
    uploadedFilenames.push(res.body.url.split('/').pop());
  });

  it('rejects a disallowed file type', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .set('Cookie', studentCookie)
      .attach('file', Buffer.from('#!/bin/sh\necho hi'), { filename: 'script.sh', contentType: 'application/x-sh' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/uploads/:filename', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/uploads/anything.pdf');
    expect(res.status).toBe(401);
  });

  it('serves a previously uploaded file to an authenticated user', async () => {
    const uploadRes = await request(app)
      .post('/api/uploads')
      .set('Cookie', studentCookie)
      .attach('file', Buffer.from('%PDF-1.4 content'), { filename: 'doc.pdf', contentType: 'application/pdf' });
    const filename = uploadRes.body.url.split('/').pop();
    uploadedFilenames.push(filename);

    const res = await request(app).get(`/api/uploads/${filename}`).set('Cookie', studentCookie);
    expect(res.status).toBe(200);
  });

  it('returns 404 for an unknown filename', async () => {
    const res = await request(app).get('/api/uploads/does-not-exist.pdf').set('Cookie', studentCookie);
    expect(res.status).toBe(404);
  });
});

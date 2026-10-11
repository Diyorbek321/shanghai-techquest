import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { createLiveRouter } from './live';
import { createRegistry } from '../live/registry';
import { persistLiveGame } from '../live/persist';
import type { LiveView } from '../live/views';

const registry = createRegistry({ persist: persistLiveGame });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/live', createLiveRouter(registry));

const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const lessonKey = unique('vitest-live-lesson');
const SECRET = 'MAXFIY-IZOH-SIZIB-KETMASLIGI-KERAK';
const CORRECT = 2;

let lessonId: string;
const ids: Record<'teacher' | 'ali' | 'vali' | 'late', string> = { teacher: '', ali: '', vali: '', late: '' };
const cookies: Record<keyof typeof ids, string> = { teacher: '', ali: '', vali: '', late: '' };

/** The latest view a user's SSE stream would carry, read straight from the registry's subscriber API. */
function viewOf(pin: string, userId: string): LiveView {
  let last: LiveView | undefined;
  const unsubscribe = registry.subscribe(pin, { userId, send: (v) => (last = v), close: () => {} });
  unsubscribe();
  return last!;
}

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 4);
  const make = (label: string, role: Role) =>
    prisma.user.create({
      data: { email: `${unique(label)}@vitest.local`, passwordHash, name: label, role, track: Track.BACKEND },
    });
  const [teacher, ali, vali, late] = await Promise.all([
    make('live-teacher', Role.TEACHER),
    make('live-ali', Role.STUDENT),
    make('live-vali', Role.STUDENT),
    make('live-late', Role.STUDENT),
  ]);
  for (const [k, u] of Object.entries({ teacher, ali, vali, late }) as [keyof typeof ids, typeof teacher][]) {
    ids[k] = u.id;
    cookies[k] = `${AUTH_COOKIE_NAME}=${signToken({ sub: u.id, role: u.role, track: u.track })}`;
  }

  const lesson = await prisma.lesson.create({
    data: {
      key: lessonKey, track: Track.BACKEND, order: 9900, month: 99, week: 99, title: 'Vitest live dars',
      section: 'Vitest', summary: 's', objectives: ['a'], homeworkMain: 'h', homeworkReview: ['r'],
      makeEasy: 'e', makeMedium: 'm', makeHard: 'h', quiz: ['q'], kind: 'lesson', xpReward: 0,
    },
  });
  lessonId = lesson.id;
  await prisma.quizQuestion.createMany({
    data: [1, 2].map((order) => ({
      lessonId, order, prompt: `Savol ${order}`, choices: ['a', 'b', 'c', 'd'], correctIndex: CORRECT, explanation: SECRET,
    })),
  });
});

afterAll(async () => {
  const userIds = Object.values(ids);
  await prisma.liveGame.deleteMany({ where: { lessonId } });
  await prisma.quizQuestion.deleteMany({ where: { lessonId } });
  await prisma.lesson.deleteMany({ where: { id: lessonId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
});

describe('live quiz API', () => {
  it('lets only staff open a game', async () => {
    await request(app).post('/api/live').set('Cookie', cookies.ali).send({ lessonKey }).expect(403);
    await request(app).post('/api/live').set('Cookie', cookies.teacher).send({ lessonKey: 'no-such-lesson' }).expect(404);
  });

  it('answers 404 for an unknown PIN', async () => {
    await request(app).post('/api/live/000000/join').set('Cookie', cookies.ali).expect(404);
    await request(app).post('/api/live/abc/join').set('Cookie', cookies.ali).expect(404);
  });

  it('plays a full game, keeps the key secret, and pays XP at the end', async () => {
    const created = await request(app).post('/api/live').set('Cookie', cookies.teacher).send({ lessonKey, timeLimitSec: 30 }).expect(201);
    const pin: string = created.body.pin;
    expect(pin).toMatch(/^\d{6}$/);

    // A stranger can't watch the stream before joining.
    await request(app).get(`/api/live/${pin}/events`).set('Cookie', cookies.ali).expect(403);
    // Only the host drives the game.
    await request(app).post(`/api/live/${pin}/next`).set('Cookie', cookies.ali).expect(403);

    await request(app).post(`/api/live/${pin}/join`).set('Cookie', cookies.ali).expect(200, { role: 'player' });
    await request(app).post(`/api/live/${pin}/join`).set('Cookie', cookies.vali).expect(200, { role: 'player' });
    await request(app).post(`/api/live/${pin}/join`).set('Cookie', cookies.teacher).expect(200, { role: 'host' });

    await request(app).post(`/api/live/${pin}/next`).set('Cookie', cookies.teacher).expect(200, { phase: 'question' });

    const open = JSON.stringify(viewOf(pin, ids.ali));
    expect(open).not.toContain(SECRET);
    expect(open).not.toContain('correctIndex');

    await request(app).post(`/api/live/${pin}/answer`).set('Cookie', cookies.ali).send({ questionIndex: 0, choiceIndex: CORRECT }).expect(202);
    await request(app).post(`/api/live/${pin}/answer`).set('Cookie', cookies.ali).send({ questionIndex: 0, choiceIndex: 0 }).expect(409);
    await request(app).post(`/api/live/${pin}/answer`).set('Cookie', cookies.vali).send({ questionIndex: 0, choiceIndex: 'x' }).expect(400);
    // Late joiners are refused once the game runs.
    await request(app).post(`/api/live/${pin}/join`).set('Cookie', cookies.late).expect(409);

    await request(app).post(`/api/live/${pin}/answer`).set('Cookie', cookies.vali).send({ questionIndex: 0, choiceIndex: 0 }).expect(202);
    // Both answered → revealed without waiting for the timer.
    const revealed = viewOf(pin, ids.ali);
    expect(revealed.phase).toBe('reveal');
    expect(revealed.reveal?.correctIndex).toBe(CORRECT);

    await request(app).post(`/api/live/${pin}/next`).set('Cookie', cookies.teacher).expect(200, { phase: 'question' });
    await request(app).post(`/api/live/${pin}/end`).set('Cookie', cookies.teacher).expect(204);

    await vi.waitFor(async () => {
      const results = await prisma.liveGameResult.findMany({ where: { game: { lessonId } }, orderBy: { rank: 'asc' } });
      expect(results.map((r) => r.userId)).toEqual([ids.ali, ids.vali]);
    });
    const [ali, vali] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: ids.ali } }),
      prisma.user.findUniqueOrThrow({ where: { id: ids.vali } }),
    ]);
    expect(ali.xp).toBeGreaterThan(vali.xp);
    expect(vali.xp).toBe(10);
  });
});

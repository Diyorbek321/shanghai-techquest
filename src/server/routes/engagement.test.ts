import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { MAX_STREAK_FREEZES, STREAK_FREEZE_ITEM_KEY } from '../shop/consumables';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

const cookieFor = (id: string, role: Role, track: Track | null) =>
  `${AUTH_COOKIE_NAME}=${signToken({ sub: id, role, track })}`;

let teacherId: string;
let teacherCookie: string;
let strangerCookie: string;
let classmateId: string;
let learnerId: string;
let learnerCookie: string;
let outsiderId: string;
let classId: string;
let freezeItemId: string;

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `Eng ${label}`, role, track } });

  const [teacher, stranger, learner, classmate, outsider] = await Promise.all([
    mk('teacher', Role.TEACHER),
    mk('stranger', Role.TEACHER),
    mk('learner', Role.STUDENT, Track.BACKEND),
    mk('classmate', Role.STUDENT, Track.BACKEND),
    mk('outsider', Role.STUDENT, Track.BACKEND),
  ]);
  teacherId = teacher.id;
  learnerId = learner.id;
  classmateId = classmate.id;
  outsiderId = outsider.id;
  teacherCookie = cookieFor(teacher.id, teacher.role, null);
  strangerCookie = cookieFor(stranger.id, stranger.role, null);
  learnerCookie = cookieFor(learner.id, learner.role, learner.track);

  const group = await prisma.classGroup.create({
    data: { title: 'Eng class', track: Track.BACKEND, teacherId: teacher.id },
  });
  classId = group.id;
  await prisma.enrollment.createMany({
    data: [
      { userId: learner.id, classId: group.id },
      { userId: classmate.id, classId: group.id },
    ],
  });

  const item = await prisma.item.upsert({
    where: { key: STREAK_FREEZE_ITEM_KEY },
    update: {},
    create: { key: STREAK_FREEZE_ITEM_KEY, name: 'Muzlatgich', type: 'BOOST', price: 150, rarity: 'COMMON' },
  });
  freezeItemId = item.id;
});

afterAll(async () => {
  const ids = [teacherId, learnerId, classmateId, outsiderId];
  await prisma.notification.deleteMany({ where: { userId: { in: ids } } });
  await prisma.enrollment.deleteMany({ where: { classId } });
  await prisma.classGroup.delete({ where: { id: classId } });
  await prisma.user.deleteMany({ where: { email: { endsWith: '@vitest.local' }, id: { in: ids } } });
  await prisma.user.deleteMany({ where: { name: 'Eng stranger' } });
});

describe('POST /api/users/:id/reward', () => {
  it('grants xp and coins and notifies the student', async () => {
    const before = await prisma.user.findUniqueOrThrow({ where: { id: learnerId } });

    await request(app)
      .post(`/api/users/${learnerId}/reward`)
      .set('Cookie', teacherCookie)
      .send({ xp: 100, coins: 50, message: 'Darsda juda faol qatnashding!' })
      .expect(200);

    const after = await prisma.user.findUniqueOrThrow({ where: { id: learnerId } });
    expect(after.xp).toBe(before.xp + 100);
    expect(after.coins).toBe(before.coins + 50);

    const note = await prisma.notification.findFirst({
      where: { userId: learnerId },
      orderBy: { createdAt: 'desc' },
    });
    expect(note?.body).toBe('Darsda juda faol qatnashding!');
    expect(note?.title).toContain('+100 XP');
  });

  it('requires a message, so points never arrive unexplained', async () => {
    await request(app).post(`/api/users/${learnerId}/reward`).set('Cookie', teacherCookie).send({ xp: 10 }).expect(400);
  });

  it('rejects a reward of nothing', async () => {
    await request(app)
      .post(`/api/users/${learnerId}/reward`)
      .set('Cookie', teacherCookie)
      .send({ xp: 0, coins: 0, message: 'Barakalla' })
      .expect(400);
  });

  it('caps a single award so the leaderboard stays meaningful', async () => {
    await request(app)
      .post(`/api/users/${learnerId}/reward`)
      .set('Cookie', teacherCookie)
      .send({ xp: 100000, message: 'Juda zo\'r' })
      .expect(400);
  });

  it('refuses a teacher who does not teach the student', async () => {
    await request(app)
      .post(`/api/users/${learnerId}/reward`)
      .set('Cookie', strangerCookie)
      .send({ xp: 10, message: 'Salom' })
      .expect(403);
  });

  it('refuses a student handing out points', async () => {
    await request(app)
      .post(`/api/users/${classmateId}/reward`)
      .set('Cookie', learnerCookie)
      .send({ xp: 10, message: 'O\'zimga' })
      .expect(403);
  });
});

describe('GET /api/leaderboard?scope=class', () => {
  it('shows classmates and hides students from other classes', async () => {
    const res = await request(app).get('/api/leaderboard?scope=class').set('Cookie', learnerCookie).expect(200);
    const ids = res.body.map((p: { id: string }) => p.id);

    expect(ids).toContain(learnerId);
    expect(ids).toContain(classmateId);
    expect(ids).not.toContain(outsiderId);
  });

  it('marks the requesting student', async () => {
    const res = await request(app).get('/api/leaderboard?scope=class').set('Cookie', learnerCookie).expect(200);
    expect(res.body.find((p: { id: string }) => p.id === learnerId)?.isUser).toBe(true);
  });

  it('still supports the existing track scope', async () => {
    const res = await request(app).get('/api/leaderboard?scope=track').set('Cookie', learnerCookie).expect(200);
    expect(res.body.map((p: { id: string }) => p.id)).toContain(outsiderId);
  });

  it('falls back to track for an unknown scope', async () => {
    const res = await request(app).get('/api/leaderboard?scope=nonsense').set('Cookie', learnerCookie).expect(200);
    expect(res.body.map((p: { id: string }) => p.id)).toContain(outsiderId);
  });
});

describe('streak freeze purchase', () => {
  it('stocks a counter rather than an inventory row, so it can be rebought', async () => {
    await prisma.user.update({ where: { id: learnerId }, data: { coins: 1000, streakFreezes: 0 } });

    await request(app).post('/api/shop/purchase').set('Cookie', learnerCookie).send({ itemId: freezeItemId }).expect(201);
    await request(app).post('/api/shop/purchase').set('Cookie', learnerCookie).send({ itemId: freezeItemId }).expect(201);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: learnerId } });
    expect(user.streakFreezes).toBe(2);

    const rows = await prisma.userInventory.count({ where: { userId: learnerId, itemId: freezeItemId } });
    expect(rows).toBe(0);
  });

  it('refuses to stock past the cap', async () => {
    await prisma.user.update({
      where: { id: learnerId },
      data: { coins: 1000, streakFreezes: MAX_STREAK_FREEZES },
    });
    await request(app).post('/api/shop/purchase').set('Cookie', learnerCookie).send({ itemId: freezeItemId }).expect(409);
  });

  it('refuses when the student cannot afford it', async () => {
    await prisma.user.update({ where: { id: learnerId }, data: { coins: 0, streakFreezes: 0 } });
    await request(app).post('/api/shop/purchase').set('Cookie', learnerCookie).send({ itemId: freezeItemId }).expect(409);
  });
});

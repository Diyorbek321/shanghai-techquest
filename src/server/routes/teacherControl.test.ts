import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { STUDENT_LOGIN_DOMAIN } from '../users/credentials';

const app = createApp();
const uniqueEmail = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vitest.local`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  return `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track })}`;
}

let ownerId: string;
let ownerCookie: string;
let strangerCookie: string;
let strangerClassId: string;
let adminCookie: string;
let studentCookie: string;
let classId: string;
const createdUserIds: string[] = [];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const mk = (label: string, role: Role, track: Track | null = null) =>
    prisma.user.create({ data: { email: uniqueEmail(label), passwordHash, name: `Ctl ${label}`, role, track } });

  const [owner, stranger, admin, student] = await Promise.all([
    mk('owner', Role.TEACHER),
    mk('stranger', Role.TEACHER),
    mk('admin', Role.ADMIN),
    mk('student', Role.STUDENT, Track.BACKEND),
  ]);
  ownerId = owner.id;
  createdUserIds.push(owner.id, stranger.id, admin.id, student.id);
  ownerCookie = cookieFor(owner.id, owner.role, null);
  strangerCookie = cookieFor(stranger.id, stranger.role, null);
  adminCookie = cookieFor(admin.id, admin.role, null);
  studentCookie = cookieFor(student.id, student.role, student.track);

  const [group, strangerGroup] = await Promise.all([
    prisma.classGroup.create({ data: { title: 'Ctl class', track: Track.BACKEND, teacherId: owner.id } }),
    prisma.classGroup.create({ data: { title: 'Ctl other', track: Track.BACKEND, teacherId: stranger.id } }),
  ]);
  classId = group.id;
  strangerClassId = strangerGroup.id;
});

afterAll(async () => {
  const ids = [classId, strangerClassId];
  await prisma.homework.deleteMany({ where: { classId: { in: ids } } });
  await prisma.notification.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.enrollment.deleteMany({ where: { classId: { in: ids } } });
  await prisma.classGroup.deleteMany({ where: { id: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
});

describe('POST /api/classes/:id/students', () => {
  it('requires staff', async () => {
    await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', studentCookie)
      .send({ names: ['Ali Valiyev'] })
      .expect(403);
  });

  it('refuses a teacher who does not own the class', async () => {
    await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', strangerCookie)
      .send({ names: ['Ali Valiyev'] })
      .expect(403);
  });

  it('creates a student, enrols them, and returns credentials once', async () => {
    const res = await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', ownerCookie)
      .send({ names: ['Nodira Karimova'] })
      .expect(201);

    expect(res.body.created).toHaveLength(1);
    const [created] = res.body.created;
    createdUserIds.push(created.id);

    expect(created.login).toBe(`nodira.karimova@${STUDENT_LOGIN_DOMAIN}`);
    expect(created.password).toMatch(/^[A-Za-z2-9]{10}$/);
    expect(created.name).toBe('Nodira Karimova');

    const enrolled = await prisma.enrollment.count({ where: { classId, userId: created.id } });
    expect(enrolled).toBe(1);

    // The student inherits the class's track, otherwise their course menu is empty.
    const row = await prisma.user.findUnique({ where: { id: created.id } });
    expect(row?.track).toBe(Track.BACKEND);
    expect(row?.role).toBe(Role.STUDENT);
  });

  it('issues a password that actually logs in', async () => {
    const res = await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', ownerCookie)
      .send({ names: ['Sardor Login'] })
      .expect(201);
    const [created] = res.body.created;
    createdUserIds.push(created.id);

    await request(app)
      .post('/api/auth/login')
      .send({ email: created.login, password: created.password })
      .expect(200);
  });

  it('never stores the password in the clear', async () => {
    const res = await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', ownerCookie)
      .send({ names: ['Hash Check'] })
      .expect(201);
    const [created] = res.body.created;
    createdUserIds.push(created.id);

    const row = await prisma.user.findUnique({ where: { id: created.id } });
    expect(row?.passwordHash).not.toBe(created.password);
    expect(await bcrypt.compare(created.password, row!.passwordHash)).toBe(true);
  });

  it('gives same-named students distinct logins in one request', async () => {
    const res = await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', ownerCookie)
      .send({ names: ['Aziz Tolibov', 'Aziz Tolibov'] })
      .expect(201);

    const logins = res.body.created.map((c: { id: string; login: string }) => {
      createdUserIds.push(c.id);
      return c.login;
    });
    expect(new Set(logins).size).toBe(2);
  });

  it('rejects an empty list', async () => {
    await request(app).post(`/api/classes/${classId}/students`).set('Cookie', ownerCookie).send({ names: [] }).expect(400);
  });

  it('404s on a class that does not exist', async () => {
    await request(app)
      .post('/api/classes/no-such-class/students')
      .set('Cookie', adminCookie)
      .send({ names: ['Ghost Student'] })
      .expect(404);
  });
});

describe('POST /api/users/:id/reset-password', () => {
  let targetId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post(`/api/classes/${classId}/students`)
      .set('Cookie', ownerCookie)
      .send({ names: ['Reset Target'] });
    targetId = res.body.created[0].id;
    createdUserIds.push(targetId);
  });

  it('lets the owning teacher reset and returns a working password', async () => {
    const res = await request(app).post(`/api/users/${targetId}/reset-password`).set('Cookie', ownerCookie).expect(200);
    expect(res.body.password).toMatch(/^[A-Za-z2-9]{10}$/);

    await request(app).post('/api/auth/login').send({ email: res.body.login, password: res.body.password }).expect(200);
  });

  it('refuses a teacher who does not teach the student', async () => {
    await request(app).post(`/api/users/${targetId}/reset-password`).set('Cookie', strangerCookie).expect(403);
  });

  it('refuses a student', async () => {
    await request(app).post(`/api/users/${targetId}/reset-password`).set('Cookie', studentCookie).expect(403);
  });

  it('refuses to reset a teacher account', async () => {
    // Guards against a teacher escalating by targeting a colleague or an admin.
    await request(app).post(`/api/users/${ownerId}/reset-password`).set('Cookie', adminCookie).expect(403);
  });
});

describe('class ownership on existing routes', () => {
  it('hides another teacher\'s roster', async () => {
    await request(app).get(`/api/classes/${classId}/students`).set('Cookie', strangerCookie).expect(403);
  });

  it('still serves the roster to the owner', async () => {
    await request(app).get(`/api/classes/${classId}/students`).set('Cookie', ownerCookie).expect(200);
  });

  it('blocks editing a class you do not own', async () => {
    await request(app).patch(`/api/classes/${classId}`).set('Cookie', strangerCookie).send({ title: 'Hijacked' }).expect(403);
  });

  it('lists only the teacher\'s own classes', async () => {
    const res = await request(app).get('/api/classes').set('Cookie', ownerCookie).expect(200);
    const ids = res.body.map((c: { id: string }) => c.id);
    expect(ids).toContain(classId);
    expect(ids).not.toContain(strangerClassId);
  });

  it('still shows an admin every class', async () => {
    const res = await request(app).get('/api/classes').set('Cookie', adminCookie).expect(200);
    const ids = res.body.map((c: { id: string }) => c.id);
    expect(ids).toEqual(expect.arrayContaining([classId, strangerClassId]));
  });
});

describe('homework targeting and monitoring', () => {
  it('assigns to one class rather than the whole track', async () => {
    const before = await prisma.homework.count({ where: { classId } });
    const res = await request(app)
      .post('/api/homework')
      .set('Cookie', ownerCookie)
      .send({ title: 'Dars 1 uy vazifasi', course: 'Python Backend', track: 'backend', classId, dueDate: new Date(Date.now() + 86_400_000).toISOString() })
      .expect(201);

    const enrolled = await prisma.enrollment.count({ where: { classId } });
    expect(res.body.created).toBe(enrolled);
    expect(await prisma.homework.count({ where: { classId } })).toBe(before + enrolled);
  });

  it('refuses to assign into a class the teacher does not own', async () => {
    await request(app)
      .post('/api/homework')
      .set('Cookie', strangerCookie)
      .send({ title: 'Nope', course: 'X', track: 'backend', classId, dueDate: new Date(Date.now() + 86_400_000).toISOString() })
      .expect(403);
  });

  it('reports per-student completion for the class', async () => {
    const res = await request(app).get(`/api/homework/overview?classId=${classId}`).set('Cookie', ownerCookie).expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const batch = res.body[0];
    expect(batch).toMatchObject({ title: 'Dars 1 uy vazifasi', course: 'Python Backend' });
    expect(batch.total).toBeGreaterThan(0);
    expect(batch.completed).toBe(0);
    expect(batch.students.length).toBe(batch.total);
    expect(batch.students[0]).toHaveProperty('name');
    expect(batch.students[0]).toHaveProperty('completed', false);
  });

  it('counts a completion once the student ticks it off', async () => {
    const row = await prisma.homework.findFirst({ where: { classId } });
    const learner = cookieFor(row!.userId, Role.STUDENT, Track.BACKEND);
    await request(app).patch(`/api/homework/${row!.id}`).set('Cookie', learner).send({ completed: true }).expect(200);

    const res = await request(app).get(`/api/homework/overview?classId=${classId}`).set('Cookie', ownerCookie).expect(200);
    expect(res.body[0].completed).toBe(1);
  });

  it('keeps the overview away from another teacher', async () => {
    await request(app).get(`/api/homework/overview?classId=${classId}`).set('Cookie', strangerCookie).expect(403);
  });

  it('keeps the overview away from students', async () => {
    await request(app).get(`/api/homework/overview?classId=${classId}`).set('Cookie', studentCookie).expect(403);
  });
});

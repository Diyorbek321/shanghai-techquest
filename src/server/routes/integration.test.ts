import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Role, SubmissionStatus, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { SERVICE_TOKEN_HEADER } from '../integration/eduly/auth';

const app = createApp();
const SECRET = process.env.EDULY_INTEGRATION_SECRET!;

// Eduly ids are plain integers shared with the real data in this database, so
// every run takes its own block far above anything real.
const base = 1_000_000_000 + Math.floor(Math.random() * 100_000_000);
const T1 = base + 1;
const G1 = base + 10;
const G2 = base + 11;
const S1 = base + 100;
const S2 = base + 101;
const S_LEGACY = base + 103;

const tag = `eduly-${base}`;
const createdUserIds: string[] = [];

function snapshot(overrides: Record<string, unknown> = {}) {
  return {
    teachers: [{ id: T1, name: `Ustoz ${tag}` }],
    groups: [
      {
        id: G1,
        title: `Python ${tag}`,
        track: 'backend',
        teacherId: T1,
        schedule: 'Toq kunlar (Dush-Chor-Jum)',
        startDate: '2026-09-01',
        lessonDays: [1, 3, 5],
      },
    ],
    students: [
      { id: S1, name: `Ali ${tag}`, active: true },
      { id: S2, name: `Vali ${tag}`, active: true },
    ],
    enrollments: [
      { studentId: S1, groupId: G1 },
      { studentId: S2, groupId: G1 },
    ],
    attendance: [{ studentId: S1, groupId: G1, date: '2026-09-02', status: 'PRESENT' }],
    ...overrides,
  };
}

const sync = (body: unknown) =>
  request(app).post('/api/integration/eduly/sync').set(SERVICE_TOKEN_HEADER, SECRET).send(body as object);

function ssoToken(sub: string, overrides: jwt.SignOptions = {}, secret = SECRET) {
  return jwt.sign({}, secret, {
    algorithm: 'HS256',
    issuer: 'eduly',
    audience: 'techquest',
    subject: sub,
    jwtid: randomUUID(),
    expiresIn: '60s',
    ...overrides,
  });
}

async function userByStudent(id: number) {
  return prisma.user.findUnique({ where: { edulyStudentId: id }, include: { enrollments: true } });
}

afterAll(async () => {
  const linked = await prisma.user.findMany({
    where: {
      OR: [
        { edulyStudentId: { gte: base, lt: base + 1000 } },
        { edulyTeacherId: { gte: base, lt: base + 1000 } },
        { id: { in: createdUserIds } },
      ],
    },
    select: { id: true },
  });
  const ids = linked.map((u) => u.id);
  await prisma.classGroup.deleteMany({ where: { edulyGroupId: { gte: base, lt: base + 1000 } } });
  await prisma.classGroup.deleteMany({ where: { teacherId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
});

describe('service auth', () => {
  it('rejects a missing or wrong token', async () => {
    await request(app).post('/api/integration/eduly/sync').send(snapshot()).expect(401);
    await request(app)
      .post('/api/integration/eduly/sync')
      .set(SERVICE_TOKEN_HEADER, 'wrong')
      .send(snapshot())
      .expect(401);
    await request(app).get('/api/integration/eduly/progress').expect(401);
  });

  it('rejects a malformed snapshot with the offending path', async () => {
    const res = await sync({ ...snapshot(), groups: [{ id: G1, title: 'x', track: 'cooking', teacherId: T1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('groups.0.track');
  });
});

describe('snapshot sync', () => {
  it('dry run reports the work and leaves nothing behind', async () => {
    const res = await sync({ ...snapshot(), dryRun: true });
    expect(res.status).toBe(200);
    expect(res.body.dryRun).toBe(true);
    expect(res.body.classes.created).toBe(1);
    expect(res.body.students.created).toBe(2);
    expect(await prisma.classGroup.findUnique({ where: { edulyGroupId: G1 } })).toBeNull();
    expect(await userByStudent(S1)).toBeNull();
  });

  it('creates the teacher, the cohort with its homework, students, enrollments and attendance', async () => {
    const res = await sync(snapshot());
    expect(res.status).toBe(200);
    expect(res.body.teachers.created).toBe(1);
    expect(res.body.classes.created).toBe(1);
    expect(res.body.students.created).toBe(2);
    expect(res.body.enrollments.added).toBe(2);
    expect(res.body.attendance.upserted).toBe(1);

    const cls = await prisma.classGroup.findUnique({
      where: { edulyGroupId: G1 },
      include: { teacher: true, _count: { select: { assignments: true } } },
    });
    expect(cls?.track).toBe(Track.BACKEND);
    expect(cls?.teacher.edulyTeacherId).toBe(T1);
    expect(cls?.lessonDays).toEqual([1, 3, 5]);
    expect(cls?._count.assignments).toBeGreaterThan(0);

    const ali = await userByStudent(S1);
    expect(ali?.role).toBe(Role.STUDENT);
    expect(ali?.track).toBe(Track.BACKEND);
    expect(ali?.disabledAt).toBeNull();
    expect(ali?.enrollments.map((e) => e.classId)).toEqual([cls!.id]);

    const att = await prisma.attendance.findMany({ where: { userId: ali!.id } });
    expect(att).toHaveLength(1);
    expect(att[0].date.toISOString()).toBe('2026-09-02T00:00:00.000Z');
  });

  it('is idempotent', async () => {
    const res = await sync(snapshot());
    expect(res.body.teachers.created).toBe(0);
    expect(res.body.classes.created).toBe(0);
    expect(res.body.classes.updated).toBe(0);
    expect(res.body.students.created).toBe(0);
    expect(res.body.enrollments.added).toBe(0);
    expect(res.body.enrollments.removed).toBe(0);
  });

  it('renames, updates attendance, and removes + disables a student who left', async () => {
    const res = await sync(
      snapshot({
        students: [{ id: S1, name: `Ali Valiyev ${tag}`, active: true }],
        enrollments: [{ studentId: S1, groupId: G1 }],
        attendance: [{ studentId: S1, groupId: G1, date: '2026-09-02', status: 'LATE' }],
      })
    );
    expect(res.status).toBe(200);
    expect(res.body.students.renamed).toBe(1);
    expect(res.body.enrollments.removed).toBe(1);
    expect(res.body.students.disabled).toBe(1);

    const ali = await userByStudent(S1);
    expect(ali?.name).toBe(`Ali Valiyev ${tag}`);
    const att = await prisma.attendance.findFirst({ where: { userId: ali!.id } });
    expect(att?.status).toBe('LATE');

    const vali = await userByStudent(S2);
    expect(vali?.disabledAt).not.toBeNull();
    expect(vali?.enrollments).toHaveLength(0);
  });

  it('re-enables a returning student without creating a second account', async () => {
    const res = await sync(snapshot());
    expect(res.body.students.created).toBe(0);
    expect(res.body.students.enabled).toBe(1);
    expect((await userByStudent(S2))?.disabledAt).toBeNull();
  });

  it('disables a frozen (inactive) student but keeps them enrolled', async () => {
    await sync(
      snapshot({
        students: [
          { id: S1, name: `Ali Valiyev ${tag}`, active: true },
          { id: S2, name: `Vali ${tag}`, active: false },
        ],
      })
    );
    const vali = await userByStudent(S2);
    expect(vali?.disabledAt).not.toBeNull();
    expect(vali?.enrollments).toHaveLength(1);
    await sync(snapshot());
  });

  it('never locks everyone out on an empty snapshot', async () => {
    const res = await sync({ teachers: [], groups: [], students: [], enrollments: [], attendance: [] });
    expect(res.status).toBe(200);
    expect(res.body.students.disabled).toBe(0);
    expect(res.body.warnings.length).toBeGreaterThan(0);
    expect((await userByStudent(S1))?.disabledAt).toBeNull();
  });

  it('links a student a teacher enrolled by hand instead of duplicating them', async () => {
    const teacher = await prisma.user.findUniqueOrThrow({ where: { edulyTeacherId: T1 } });
    const manual = await prisma.classGroup.create({
      data: { title: `Manual ${tag}`, track: Track.BACKEND, teacherId: teacher.id },
    });
    const legacy = await prisma.user.create({
      data: {
        email: `legacy-${tag}@vitest.local`,
        passwordHash: await bcrypt.hash('password123', 4),
        name: `Legacy ${tag}`,
        role: Role.STUDENT,
        track: Track.BACKEND,
        enrollments: { create: { classId: manual.id } },
      },
    });
    createdUserIds.push(legacy.id);
    // The cohort already exists in TechQuest; an operator links it once by id.
    await prisma.classGroup.update({ where: { id: manual.id }, data: { edulyGroupId: G2 } });

    const res = await sync(
      snapshot({
        groups: [...snapshot().groups, { id: G2, title: `Manual ${tag}`, track: 'backend', teacherId: T1 }],
        students: [...snapshot().students, { id: S_LEGACY, name: `legacy ${tag}`, active: true }],
        enrollments: [...snapshot().enrollments, { studentId: S_LEGACY, groupId: G2 }],
      })
    );
    expect(res.body.students.linked).toBe(1);
    expect(res.body.students.created).toBe(0);
    expect((await userByStudent(S_LEGACY))?.id).toBe(legacy.id);
  });

  it('warns and skips a new group with no teacher', async () => {
    const res = await sync(
      snapshot({
        groups: [...snapshot().groups, { id: base + 12, title: `No teacher ${tag}`, track: 'backend', teacherId: null }],
      })
    );
    expect(res.status).toBe(200);
    expect(res.body.warnings.some((w: string) => w.includes(`eduly #${base + 12}`))).toBe(true);
    expect(await prisma.classGroup.findUnique({ where: { edulyGroupId: base + 12 } })).toBeNull();
  });
});

describe('progress report', () => {
  it('counts a lesson as done when its homework is handed in', async () => {
    const ali = await userByStudent(S1);
    const cls = await prisma.classGroup.findUniqueOrThrow({ where: { edulyGroupId: G1 } });
    const first = await prisma.assignment.findFirstOrThrow({
      where: { classId: cls.id, lessonId: { not: null } },
      include: { lesson: true },
      orderBy: { lesson: { order: 'asc' } },
    });
    await prisma.submission.create({
      data: { assignmentId: first.id, userId: ali!.id, status: SubmissionStatus.SUBMITTED, submittedAt: new Date() },
    });

    const res = await request(app).get('/api/integration/eduly/progress').set(SERVICE_TOKEN_HEADER, SECRET);
    expect(res.status).toBe(200);
    const row = res.body.students.find((s: { edulyStudentId: number }) => s.edulyStudentId === S1);
    expect(row.track).toBe('backend');
    expect(row.lessonsCompleted).toBe(1);
    expect(row.lessonsTotal).toBeGreaterThan(1);
    expect(row.nextLesson.order).toBeGreaterThan(first.lesson!.order);
    expect(row.overdueHomework).toBeGreaterThan(0);
    expect(row.disabled).toBe(false);
  });
});

describe('SSO', () => {
  const sso = (token: string) => request(app).get(`/api/integration/eduly-sso?token=${encodeURIComponent(token)}`);

  it('signs a linked student in and redirects home', async () => {
    const res = await sso(ssoToken(`student:${S1}`));
    expect(res.status).toBe(303);
    expect(res.headers.location).toBe('/');
    const cookie = String(res.headers['set-cookie']);
    expect(cookie).toContain(`${AUTH_COOKIE_NAME}=`);

    const me = await request(app).get('/api/auth/me').set('Cookie', cookie.split(';')[0]);
    expect(me.status).toBe(200);
    expect(me.body.name).toBe(`Ali ${tag}`);
  });

  it('signs a linked teacher in', async () => {
    const res = await sso(ssoToken(`teacher:${T1}`));
    expect(res.headers.location).toBe('/');
  });

  it('refuses a replayed token', async () => {
    const token = ssoToken(`student:${S1}`);
    expect((await sso(token)).headers.location).toBe('/');
    expect((await sso(token)).headers.location).toBe('/?sso_error=used');
  });

  it('refuses bad signature, wrong audience, expired, and long-lived tokens', async () => {
    const bad = [
      ssoToken(`student:${S1}`, {}, 'another-secret'),
      ssoToken(`student:${S1}`, { audience: 'someone-else' }),
      ssoToken(`student:${S1}`, { expiresIn: '-10s' }),
      jwt.sign({ iat: Math.floor(Date.now() / 1000) - 600 }, SECRET, {
        algorithm: 'HS256', issuer: 'eduly', audience: 'techquest', subject: `student:${S1}`, jwtid: randomUUID(), expiresIn: '1h',
      }),
      ssoToken(`admin:${S1}`),
      'garbage',
    ];
    for (const token of bad) {
      const res = await sso(token);
      expect(res.headers.location, token).toBe('/?sso_error=invalid');
      expect(res.headers['set-cookie']).toBeUndefined();
    }
  });

  it('refuses an unknown or disabled student', async () => {
    expect((await sso(ssoToken(`student:${base + 999}`))).headers.location).toBe('/?sso_error=unknown');
    await prisma.user.update({ where: { edulyStudentId: S2 }, data: { disabledAt: new Date() } });
    expect((await sso(ssoToken(`student:${S2}`))).headers.location).toBe('/?sso_error=disabled');
  });

  it('cuts off an existing session once the student is disabled', async () => {
    const vali = await userByStudent(S2);
    const cookie = `${AUTH_COOKIE_NAME}=${signToken({ sub: vali!.id, role: vali!.role, track: vali!.track })}`;
    expect((await request(app).get('/api/auth/me').set('Cookie', cookie)).status).toBe(403);
  });
});

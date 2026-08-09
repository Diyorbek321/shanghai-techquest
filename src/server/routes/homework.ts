import { Router } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { TRACK_VALUES, toClientTrack, toPrismaTrack } from '../serializers/track';
import { resolveTrackFilter } from '../utils/trackScope';
import { teacherOwnsClass } from '../utils/teacherScope';
import { Role } from '@prisma/client';
import { checkAchievements } from '../achievements/check';
import { notifyMany } from '../notifications/notify';

export const homeworkRouter = Router();

homeworkRouter.use(requireAuth);

homeworkRouter.get('/', async (req, res) => {
  const where =
    req.user!.role === Role.STUDENT
      ? { userId: req.user!.id }
      : { track: resolveTrackFilter(req) };

  const homework = await prisma.homework.findMany({
    where,
    orderBy: { dueDate: 'asc' },
  });
  res.json(homework.map((h) => ({ ...h, track: toClientTrack(h.track) })));
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  course: z.string().min(1).max(200),
  track: z.enum(TRACK_VALUES),
  dueDate: z.coerce.date(),
  /// Target one cohort. Omitted, the assignment falls back to the older
  /// broadcast to everyone on the track.
  classId: z.string().min(1).optional(),
});

// Creating homework fans it out into one row per student so each can tick their
// own copy off; the rows share a batchId so the teacher's overview can roll them
// back up (GET /overview).
homeworkRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const track = toPrismaTrack(parsed.data.track);
  const { classId } = parsed.data;

  if (classId && !(await teacherOwnsClass(req.user!, classId))) {
    return res.status(403).json({ error: "Bu sinfga uy vazifasi berish huquqingiz yo'q." });
  }

  const students = await prisma.user.findMany({
    where: classId
      ? { role: Role.STUDENT, enrollments: { some: { classId } } }
      : { role: Role.STUDENT, track },
    select: { id: true },
  });

  if (students.length === 0) {
    return res.status(400).json({ error: classId ? "Bu sinfda o'quvchi yo'q." : "Bu yo'nalishda o'quvchi topilmadi." });
  }

  const batchId = randomUUID();
  await prisma.homework.createMany({
    data: students.map((s) => ({
      userId: s.id,
      track,
      classId,
      batchId,
      title: parsed.data.title,
      course: parsed.data.course,
      dueDate: parsed.data.dueDate,
    })),
  });

  await notifyMany(prisma, students.map((s) => s.id), {
    type: 'INFO',
    title: 'Yangi uy vazifasi',
    body: `"${parsed.data.title}" nomli yangi uy vazifasi qo'shildi.`,
  });

  res.status(201).json({ created: students.length, batchId });
});

/**
 * Per-assignment completion for one class: what was set, and which students
 * have ticked it off. Rows created before batchId existed are grouped by their
 * (title, course, dueDate) instead, so older homework still shows up.
 */
homeworkRouter.get('/overview', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const classId = typeof req.query.classId === 'string' ? req.query.classId : null;
  if (!classId) {
    return res.status(400).json({ error: 'classId talab qilinadi.' });
  }
  if (!(await teacherOwnsClass(req.user!, classId))) {
    return res.status(403).json({ error: "Bu sinfni ko'rish huquqingiz yo'q." });
  }

  const rows = await prisma.homework.findMany({
    where: { classId },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { dueDate: 'desc' },
  });

  const batches = new Map<string, {
    batchId: string | null;
    title: string;
    course: string;
    dueDate: Date;
    total: number;
    completed: number;
    students: { id: string; name: string; avatar: string | null; completed: boolean }[];
  }>();

  for (const row of rows) {
    const key = row.batchId ?? `${row.title}|${row.course}|${row.dueDate.toISOString()}`;
    const batch = batches.get(key) ?? {
      batchId: row.batchId,
      title: row.title,
      course: row.course,
      dueDate: row.dueDate,
      total: 0,
      completed: 0,
      students: [],
    };
    batch.total += 1;
    if (row.completed) batch.completed += 1;
    batch.students.push({
      id: row.user.id,
      name: row.user.name,
      avatar: row.user.avatarUrl,
      completed: row.completed,
    });
    batches.set(key, batch);
  }

  res.json([...batches.values()]);
});

const updateSchema = z.object({
  completed: z.boolean(),
});

homeworkRouter.patch('/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const existing = await prisma.homework.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Uy vazifasi topilmadi.' });
  }
  const updated = await prisma.homework.update({
    where: { id: req.params.id },
    data: { completed: parsed.data.completed },
  });
  if (updated.completed) {
    await checkAchievements(req.user!.id);
  }
  res.json({ ...updated, track: toClientTrack(updated.track) });
});

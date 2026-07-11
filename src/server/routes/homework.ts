import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { toClientTrack, toPrismaTrack } from '../serializers/track';
import { resolveTrackFilter } from '../utils/trackScope';
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
  track: z.enum(['frontend', 'robotics', 'office']),
  dueDate: z.coerce.date(),
});

// Homework is broadcast-by-track (see GET '/' above, which filters non-students
// by track): creating homework fans it out into one row per enrolled student
// in that track, mirroring how assignmentsRouter.post('/') notifies students.
homeworkRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const track = toPrismaTrack(parsed.data.track);

  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT, track },
    select: { id: true },
  });

  if (students.length === 0) {
    return res.status(400).json({ error: "Bu yo'nalishda o'quvchi topilmadi." });
  }

  await prisma.homework.createMany({
    data: students.map((s) => ({
      userId: s.id,
      track,
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

  res.status(201).json({ created: students.length });
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

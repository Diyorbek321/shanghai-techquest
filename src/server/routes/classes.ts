import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { resolveTrackFilter } from '../utils/trackScope';
import { toClientTrack, toPrismaTrack } from '../serializers/track';

export const classesRouter = Router();

classesRouter.use(requireAuth);

classesRouter.get('/', async (req, res) => {
  const track = resolveTrackFilter(req);
  const classes = await prisma.classGroup.findMany({
    where: track ? { track } : undefined,
    include: { teacher: { select: { name: true } }, _count: { select: { enrollments: true } } },
    orderBy: { title: 'asc' },
  });
  res.json(
    classes.map((c) => ({
      id: c.id,
      title: c.title,
      track: toClientTrack(c.track),
      teacherName: c.teacher.name,
      schedule: c.schedule,
      studentCount: c._count.enrollments,
    }))
  );
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  track: z.enum(['frontend', 'robotics', 'office']),
  schedule: z.string().max(200).optional(),
});

classesRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const created = await prisma.classGroup.create({
    data: {
      title: parsed.data.title,
      track: toPrismaTrack(parsed.data.track),
      schedule: parsed.data.schedule,
      teacherId: req.user!.id,
    },
  });
  res.status(201).json({ ...created, track: toClientTrack(created.track) });
});

classesRouter.get('/:id/students', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { classId: req.params.id },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true, xp: true, level: true },
      },
    },
  });

  const studentIds = enrollments.map((e) => e.userId);
  const grades = await prisma.grade.findMany({ where: { userId: { in: studentIds } } });
  const gradesByUser = new Map<string, number[]>();
  for (const g of grades) {
    const list = gradesByUser.get(g.userId) ?? [];
    list.push((g.score / g.maxScore) * 100);
    gradesByUser.set(g.userId, list);
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: { in: studentIds }, status: 'GRADED' },
    orderBy: { submittedAt: 'desc' },
    take: studentIds.length,
  });
  const lastSubmissionByUser = new Map(submissions.map((s) => [s.userId, s.submittedAt]));

  res.json(
    enrollments.map((e) => {
      const scores = gradesByUser.get(e.userId) ?? [];
      const averageScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
      return {
        id: e.user.id,
        name: e.user.name,
        avatar: e.user.avatarUrl,
        xp: e.user.xp,
        level: e.user.level,
        averageScore,
        lastSubmittedAt: lastSubmissionByUser.get(e.userId) ?? null,
      };
    })
  );
});

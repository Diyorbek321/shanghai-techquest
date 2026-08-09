import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { resolveTrackFilter } from '../utils/trackScope';
import { TRACK_VALUES, toClientTrack, toPrismaTrack } from '../serializers/track';
import { notifyMany } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';

export const assignmentsRouter = Router();

assignmentsRouter.use(requireAuth);

function serializeAssignment(a: {
  id: string;
  title: string;
  description: string;
  track: import('@prisma/client').Track;
  classId: string | null;
  dueDate: Date;
  xpReward: number;
  moduleKey: string | null;
}) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    track: toClientTrack(a.track),
    classId: a.classId,
    dueDate: a.dueDate,
    xpReward: a.xpReward,
    moduleKey: a.moduleKey,
  };
}

assignmentsRouter.get('/', async (req, res) => {
  const track = resolveTrackFilter(req);
  const moduleKey = typeof req.query.moduleKey === 'string' ? req.query.moduleKey : undefined;
  const assignments = await prisma.assignment.findMany({
    where: { ...(track ? { track } : undefined), ...(moduleKey ? { moduleKey } : undefined) },
    orderBy: { dueDate: 'asc' },
  });

  if (req.user!.role === Role.STUDENT) {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.id, assignmentId: { in: assignments.map((a) => a.id) } },
    });
    const byAssignment = new Map(submissions.map((s) => [s.assignmentId, s]));
    return res.json(
      assignments.map((a) => ({ ...serializeAssignment(a), submission: byAssignment.get(a.id) ?? null }))
    );
  }

  res.json(assignments.map(serializeAssignment));
});

assignmentsRouter.get('/:id', async (req, res) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: req.params.id } });
  if (!assignment) {
    return res.status(404).json({ error: 'Vazifa topilmadi.' });
  }
  let submission = null;
  if (req.user!.role === Role.STUDENT) {
    submission = await prisma.submission.findUnique({
      where: { assignmentId_userId: { assignmentId: assignment.id, userId: req.user!.id } },
    });
  }
  res.json({ ...serializeAssignment(assignment), submission });
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  track: z.enum(TRACK_VALUES),
  classId: z.string().optional(),
  dueDate: z.coerce.date(),
  xpReward: z.coerce.number().int().min(0).default(0),
});

assignmentsRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const created = await prisma.assignment.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      track: toPrismaTrack(parsed.data.track),
      classId: parsed.data.classId,
      dueDate: parsed.data.dueDate,
      xpReward: parsed.data.xpReward,
    },
  });

  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT, track: created.track },
    select: { id: true },
  });
  await notifyMany(prisma, students.map((s) => s.id), {
    type: 'INFO',
    title: 'Yangi vazifa',
    body: `"${created.title}" nomli yangi vazifa qo'shildi.`,
  });

  res.status(201).json(serializeAssignment(created));
});

const httpUrl = (message: string) =>
  z
    .string()
    .url({ message })
    .refine((url) => /^https?:\/\//i.test(url), { message });

const submitSchema = z
  .object({
    githubUrl: httpUrl("GitHub repozitoriy manzili noto'g'ri.").optional(),
    demoUrl: httpUrl("Demo manzili noto'g'ri.").optional(),
    fileUrl: z.string().refine((v) => v.startsWith('/api/uploads/'), { message: 'Fayl manzili yaroqsiz.' }).optional(),
    fileName: z.string().min(1).max(255).optional(),
    content: z.string().max(2000).optional(),
  })
  .refine((data) => Boolean(data.githubUrl || data.fileUrl), {
    message: "GitHub havolasi yoki fayl biriktirilishi shart.",
    path: ['githubUrl'],
  });

assignmentsRouter.post('/:id/submissions', requireRole(Role.STUDENT), async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const assignment = await prisma.assignment.findUnique({ where: { id: req.params.id } });
  if (!assignment) {
    return res.status(404).json({ error: 'Vazifa topilmadi.' });
  }
  const submission = await prisma.submission.upsert({
    where: { assignmentId_userId: { assignmentId: assignment.id, userId: req.user!.id } },
    update: {
      githubUrl: parsed.data.githubUrl ?? null,
      demoUrl: parsed.data.demoUrl ?? null,
      fileUrl: parsed.data.fileUrl ?? null,
      fileName: parsed.data.fileName ?? null,
      content: parsed.data.content ?? null,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
    create: {
      assignmentId: assignment.id,
      userId: req.user!.id,
      githubUrl: parsed.data.githubUrl,
      demoUrl: parsed.data.demoUrl,
      fileUrl: parsed.data.fileUrl,
      fileName: parsed.data.fileName,
      content: parsed.data.content,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  if (assignment.moduleKey) {
    const existingProgress = await prisma.moduleProgress.findUnique({
      where: { userId_moduleKey: { userId: req.user!.id, moduleKey: assignment.moduleKey } },
    });
    await prisma.moduleProgress.upsert({
      where: { userId_moduleKey: { userId: req.user!.id, moduleKey: assignment.moduleKey } },
      update: { progress: Math.max(existingProgress?.progress ?? 0, 50), unlocked: true },
      create: { userId: req.user!.id, track: assignment.track, moduleKey: assignment.moduleKey, progress: 50, unlocked: true },
    });
  }

  await checkAchievements(req.user!.id);

  res.status(201).json(submission);
});

assignmentsRouter.get('/:id/submissions', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const submissions = await prisma.submission.findMany({
    where: { assignmentId: req.params.id },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });
  res.json(submissions);
});

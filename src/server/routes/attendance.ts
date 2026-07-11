import { Router } from 'express';
import { z } from 'zod';
import { Role, AttendanceStatus } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';

export const attendanceRouter = Router();

attendanceRouter.use(requireAuth);

attendanceRouter.get('/', async (req, res) => {
  if (req.user!.role === Role.STUDENT) {
    const records = await prisma.attendance.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: 'desc' },
    });
    return res.json(records);
  }

  const classId = typeof req.query.classId === 'string' ? req.query.classId : undefined;
  const date = typeof req.query.date === 'string' ? new Date(req.query.date) : undefined;
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

  const records = await prisma.attendance.findMany({
    where: { classId, date, userId },
    orderBy: { date: 'desc' },
  });
  res.json(records);
});

const createSchema = z.object({
  userId: z.string(),
  classId: z.string().optional(),
  date: z.coerce.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as [AttendanceStatus, ...AttendanceStatus[]]),
});

attendanceRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  if (parsed.data.classId) {
    const record = await prisma.attendance.upsert({
      where: {
        userId_classId_date: {
          userId: parsed.data.userId,
          classId: parsed.data.classId,
          date: parsed.data.date,
        },
      },
      update: { status: parsed.data.status },
      create: parsed.data,
    });
    return res.status(201).json(record);
  }

  const record = await prisma.attendance.create({ data: parsed.data });
  res.status(201).json(record);
});

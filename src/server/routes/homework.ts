import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack } from '../serializers/track';
import { resolveTrackFilter } from '../utils/trackScope';
import { Role } from '@prisma/client';
import { checkAchievements } from '../achievements/check';

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

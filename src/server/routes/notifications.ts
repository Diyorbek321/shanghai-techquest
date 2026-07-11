import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { notify } from '../notifications/notify';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notifications);
});

const sendSchema = z.object({
  userId: z.string(),
  body: z.string().min(1).max(1000),
});

// Lets a teacher/admin message an individual student (e.g. from the class
// roster's "send message" action) via the existing notification feed.
notificationsRouter.post('/', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const student = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!student) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
  }
  await notify(prisma, {
    userId: parsed.data.userId,
    type: 'INFO',
    title: `Xabar: ${req.user!.name}`,
    body: parsed.data.body,
  });
  res.status(201).json({ ok: true });
});

notificationsRouter.patch('/:id/read', async (req, res) => {
  const existing = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Bildirishnoma topilmadi.' });
  }
  const updated = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json(updated);
});

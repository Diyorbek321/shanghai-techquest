import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notifications);
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

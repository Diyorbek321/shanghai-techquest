import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const gradesRouter = Router();

gradesRouter.use(requireAuth);

gradesRouter.get('/', async (req, res) => {
  if (req.user!.role === Role.STUDENT) {
    const grades = await prisma.grade.findMany({
      where: { userId: req.user!.id },
      orderBy: { gradedAt: 'desc' },
    });
    return res.json(grades);
  }

  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
  const grades = await prisma.grade.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { gradedAt: 'desc' },
  });
  res.json(grades);
});

import { Router } from 'express';
import { z } from 'zod';
import { BuildingType } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { serializeUser } from '../serializers/user';

export const cityRouter = Router();

cityRouter.use(requireAuth);

const NEW_BUILDING_COST = 300;
const MAX_BUILDING_LEVEL = 5;

class InsufficientCoinsError extends Error {}

const positionSchema = z.tuple([z.number(), z.number(), z.number()]);

cityRouter.get('/buildings', async (req, res) => {
  const buildings = await prisma.building.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'asc' },
  });
  res.json(buildings);
});

const createSchema = z.object({
  type: z.enum(['RESIDENTIAL', 'TECH', 'INDUSTRIAL', 'MONUMENT'] as [BuildingType, ...BuildingType[]]),
  position: positionSchema,
  color: z.string().min(1),
  secondaryColor: z.string().optional(),
  name: z.string().min(1).max(100),
});

cityRouter.post('/buildings', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: req.user!.id, coins: { gte: NEW_BUILDING_COST } },
        data: { coins: { decrement: NEW_BUILDING_COST } },
      });
      if (count === 0) throw new InsufficientCoinsError();

      const building = await tx.building.create({
        data: {
          userId: req.user!.id,
          type: parsed.data.type,
          position: [parsed.data.position[0], parsed.data.position[1], parsed.data.position[2]] as number[],
          color: parsed.data.color,
          secondaryColor: parsed.data.secondaryColor,
          name: parsed.data.name,
        },
      });
      const user = await tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
      return { building, user };
    });
    res.status(201).json({ building: result.building, user: serializeUser(result.user) });
  } catch (err) {
    if (err instanceof InsufficientCoinsError) {
      return res.status(409).json({ error: 'Tangalar yetarli emas.' });
    }
    throw err;
  }
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().min(1).optional(),
  secondaryColor: z.string().optional(),
});

cityRouter.patch('/buildings/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const existing = await prisma.building.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Bino topilmadi.' });
  }
  const building = await prisma.building.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(building);
});

cityRouter.post('/buildings/:id/upgrade', async (req, res) => {
  const existing = await prisma.building.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Bino topilmadi.' });
  }
  if (existing.level >= MAX_BUILDING_LEVEL) {
    return res.status(409).json({ error: 'Bino allaqachon maksimal darajada.' });
  }
  const cost = existing.level * 150;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: req.user!.id, coins: { gte: cost } },
        data: { coins: { decrement: cost } },
      });
      if (count === 0) throw new InsufficientCoinsError();

      const building = await tx.building.update({
        where: { id: existing.id },
        data: { level: Math.min(existing.level + 1, MAX_BUILDING_LEVEL) },
      });
      const user = await tx.user.findUniqueOrThrow({ where: { id: req.user!.id } });
      return { building, user };
    });
    res.json({ building: result.building, user: serializeUser(result.user) });
  } catch (err) {
    if (err instanceof InsufficientCoinsError) {
      return res.status(409).json({ error: 'Tangalar yetarli emas.' });
    }
    throw err;
  }
});

cityRouter.delete('/buildings/:id', async (req, res) => {
  const existing = await prisma.building.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Bino topilmadi.' });
  }
  await prisma.building.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

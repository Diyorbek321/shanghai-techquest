import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { serializeUser } from '../serializers/user';
import { checkAchievements } from '../achievements/check';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/me', (req, res) => {
  res.json(serializeUser(req.user!));
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  theme: z.enum(['dark', 'neon', 'cyber']).optional(),
  audioEnabled: z.boolean().optional(),
  onlineVisible: z.boolean().optional(),
  profilePublic: z.boolean().optional(),
});

usersRouter.patch('/me', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { theme, ...rest } = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...rest,
      theme: theme ? (theme.toUpperCase() as 'DARK' | 'NEON' | 'CYBER') : undefined,
    },
  });
  res.json(serializeUser(user));
});

usersRouter.post('/me/heartbeat', async (req, res) => {
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { lastSeenAt: new Date() },
  });
  res.status(204).send();
});

const rewardSchema = z.object({
  xp: z.number().int().positive().optional(),
  coins: z.number().int().positive().optional(),
});

usersRouter.post('/me/reward', async (req, res) => {
  const parsed = rewardSchema.safeParse(req.body);
  if (!parsed.success || (!parsed.data.xp && !parsed.data.coins)) {
    return res.status(400).json({ error: "Musbat XP va/yoki tanga miqdorini kiriting." });
  }
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      xp: parsed.data.xp ? { increment: parsed.data.xp } : undefined,
      coins: parsed.data.coins ? { increment: parsed.data.coins } : undefined,
    },
  });
  await checkAchievements(req.user!.id);
  res.json(serializeUser(user));
});

const spendSchema = z.object({
  coins: z.number().int().positive(),
});

usersRouter.post('/me/spend', async (req, res) => {
  const parsed = spendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Musbat tanga miqdorini kiriting.' });
  }
  const { count } = await prisma.user.updateMany({
    where: { id: req.user!.id, coins: { gte: parsed.data.coins } },
    data: { coins: { decrement: parsed.data.coins } },
  });
  if (count === 0) {
    return res.status(409).json({ error: 'Tangalar yetarli emas.' });
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
  res.json(serializeUser(user));
});

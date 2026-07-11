import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack, toPrismaTrack, ClientTrack } from '../serializers/track';

export const progressRouter = Router();

progressRouter.use(requireAuth);

progressRouter.get('/modules', async (req, res) => {
  const queryTrack = typeof req.query.track === 'string' ? (req.query.track as ClientTrack) : undefined;
  const track = queryTrack ? toPrismaTrack(queryTrack) : (req.user!.track ?? undefined);

  const rows = await prisma.moduleProgress.findMany({
    where: { userId: req.user!.id, track },
  });
  res.json(rows.map((r) => ({ ...r, track: toClientTrack(r.track) })));
});

const updateSchema = z.object({
  progress: z.number().int().min(0).max(100).optional(),
  unlocked: z.boolean().optional(),
});

progressRouter.patch('/modules/:moduleKey', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  if (!req.user!.track) {
    return res.status(400).json({ error: "Hisobingizga yo'nalish biriktirilmagan." });
  }

  const row = await prisma.moduleProgress.upsert({
    where: { userId_moduleKey: { userId: req.user!.id, moduleKey: req.params.moduleKey } },
    update: parsed.data,
    create: {
      userId: req.user!.id,
      track: req.user!.track,
      moduleKey: req.params.moduleKey,
      progress: parsed.data.progress ?? 0,
      unlocked: parsed.data.unlocked ?? false,
    },
  });
  res.json({ ...row, track: toClientTrack(row.track) });
});

import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack } from '../serializers/track';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

leaderboardRouter.get('/', async (req, res) => {
  const scope = req.query.scope === 'global' ? 'global' : 'track';
  const track = scope === 'track' ? req.user!.track : undefined;
  const sortBy = req.query.sortBy === 'elo' ? 'eloRating' : 'xp';

  const players = await prisma.user.findMany({
    where: {
      role: Role.STUDENT,
      ...(track ? { track } : {}),
    },
    orderBy: { [sortBy]: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      level: true,
      xp: true,
      streak: true,
      track: true,
      eloRating: true,
    },
  });

  res.json(
    players.map((p, i) => ({
      rank: i + 1,
      id: p.id,
      name: p.name,
      avatar: p.avatarUrl,
      level: p.level,
      xp: p.xp,
      streak: p.streak,
      track: toClientTrack(p.track),
      eloRating: p.eloRating,
      isUser: p.id === req.user!.id,
    }))
  );
});

import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack } from '../serializers/track';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

const SCOPES = ['global', 'track', 'class'] as const;
type Scope = (typeof SCOPES)[number];

leaderboardRouter.get('/', async (req, res) => {
  const requested = req.query.scope;
  const scope: Scope = SCOPES.includes(requested as Scope) ? (requested as Scope) : 'track';
  const track = scope === 'track' ? req.user!.track : undefined;
  const sortBy = req.query.sortBy === 'elo' ? 'eloRating' : 'xp';

  // Ranking against your own classmates is the board a student actually cares
  // about — a global top-50 is unreachable and says nothing about the room they
  // sit in. Staff have no enrollments, so for them this scope is empty by
  // definition and falls back to showing nothing rather than everyone.
  let classFilter = {};
  if (scope === 'class') {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      select: { classId: true },
    });
    classFilter = { enrollments: { some: { classId: { in: enrollments.map((e) => e.classId) } } } };
  }

  const players = await prisma.user.findMany({
    where: {
      role: Role.STUDENT,
      ...(track ? { track } : {}),
      ...classFilter,
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

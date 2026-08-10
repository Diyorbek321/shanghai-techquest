import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack } from '../serializers/track';
import { leagueWindow } from '../leaderboard/leagues';
import { weeklyProgress } from '../leaderboard/progress';

export const leaderboardRouter = Router();

leaderboardRouter.use(requireAuth);

const SCOPES = ['global', 'track', 'class'] as const;
type Scope = (typeof SCOPES)[number];

/**
 * Upper bound on how many students are ranked in one request. A school-sized
 * cohort is far below this; the cap only exists so a runaway dataset cannot
 * turn one board render into an unbounded query.
 */
const MAX_RANKED = 2000;

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

  // The whole scope is ranked, then narrowed to the caller's league — the slice
  // cannot be pushed into the query because which slice to take depends on
  // where the caller lands in the ordering. `id` breaks ties so two students on
  // equal XP get a stable order instead of swapping places between requests.
  const ranked = await prisma.user.findMany({
    where: {
      role: Role.STUDENT,
      ...(track ? { track } : {}),
      ...classFilter,
    },
    orderBy: [{ [sortBy]: 'desc' }, { id: 'asc' }],
    take: MAX_RANKED,
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

  const position = ranked.findIndex((p) => p.id === req.user!.id);
  const league = leagueWindow(ranked, position);

  res.json({
    league: {
      name: league.name,
      index: league.index,
      total: league.total,
      size: league.members.length,
    },
    // Personal progress sits next to the ranking on purpose: position is a
    // comparison a student can lose through no fault of their own, while "you
    // solved more than last week" is feedback about their own work.
    progress: await weeklyProgress(prisma, req.user!.id),
    players: league.members.map((p, i) => ({
      // League-relative, never the global position. A student at the bottom of
      // the whole cohort sees "#23 in Bronza", not "#347 of 400".
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
    })),
  });
});

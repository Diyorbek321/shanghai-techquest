import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { resolveTrackFilter } from '../utils/trackScope';
import { toClientTrack } from '../serializers/track';

export const calendarRouter = Router();

calendarRouter.use(requireAuth);

calendarRouter.get('/', async (req, res) => {
  const track = resolveTrackFilter(req);
  const events = await prisma.calendarEvent.findMany({
    where: track ? { OR: [{ track }, { track: null }] } : undefined,
    orderBy: { startsAt: 'asc' },
  });
  res.json(events.map((e) => ({ ...e, track: toClientTrack(e.track) })));
});

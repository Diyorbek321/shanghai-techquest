import { Request } from 'express';
import { Track } from '@prisma/client';
import { toPrismaTrack, ClientTrack } from '../serializers/track';

const VALID_TRACKS: ClientTrack[] = ['frontend', 'robotics', 'office'];

/** Returns the Prisma Track to filter list queries by, or undefined for "no filter" (staff with no ?track= query see everything). */
export function resolveTrackFilter(req: Request): Track | undefined {
  const user = req.user!;
  if (user.role === 'STUDENT') {
    return user.track ?? undefined;
  }
  const queryTrack = req.query.track;
  if (typeof queryTrack === 'string' && VALID_TRACKS.includes(queryTrack as ClientTrack)) {
    return toPrismaTrack(queryTrack as ClientTrack);
  }
  return undefined;
}

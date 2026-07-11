import { Track as PrismaTrack } from '@prisma/client';

export type ClientTrack = 'frontend' | 'robotics' | 'office';

export function toClientTrack(track: PrismaTrack | null): ClientTrack | null {
  return track ? (track.toLowerCase() as ClientTrack) : null;
}

export function toPrismaTrack(track: ClientTrack): PrismaTrack {
  return track.toUpperCase() as PrismaTrack;
}

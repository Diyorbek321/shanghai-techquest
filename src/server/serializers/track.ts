import { Track as PrismaTrack } from '@prisma/client';

/**
 * Single source of truth for the client-facing track values. Route schemas build
 * their `z.enum` from this, so adding a track is one edit rather than seven.
 */
export const TRACK_VALUES = ['frontend', 'robotics', 'office', 'backend'] as const;

export type ClientTrack = (typeof TRACK_VALUES)[number];

export function toClientTrack(track: PrismaTrack | null): ClientTrack | null {
  return track ? (track.toLowerCase() as ClientTrack) : null;
}

export function toPrismaTrack(track: ClientTrack): PrismaTrack {
  return track.toUpperCase() as PrismaTrack;
}

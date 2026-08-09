import type { User as PrismaUser } from '@prisma/client';
import { avatarUrlForEmail } from '../avatar';
import { toClientTrack } from './track';

export function serializeUser(user: PrismaUser) {
  const nextLevelXp = Math.floor(user.xp / 500) * 500 + 500;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatarUrl ?? avatarUrlForEmail(user.email),
    level: user.level,
    title: user.title ?? 'Student',
    xp: user.xp,
    nextLevelXp,
    streak: user.streak,
    streakFreezes: user.streakFreezes,
    coins: user.coins,
    role: user.role.toLowerCase() as 'student' | 'teacher' | 'admin',
    track: toClientTrack(user.track),
    theme: user.theme.toLowerCase() as 'dark' | 'neon' | 'cyber',
    audioEnabled: user.audioEnabled,
    pushEnabled: user.pushEnabled,
    onlineVisible: user.onlineVisible,
    profilePublic: user.profilePublic,
    eloRating: user.eloRating,
    teamId: user.teamId,
    teamRole: user.teamRole ? (user.teamRole.toLowerCase() as 'leader' | 'member') : null,
    createdAt: user.createdAt,
  };
}

import type { User as PrismaUser } from '@prisma/client';

export function serializeUser(user: PrismaUser) {
  const nextLevelXp = Math.floor(user.xp / 500) * 500 + 500;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
    level: user.level,
    title: user.title ?? 'Student',
    xp: user.xp,
    nextLevelXp,
    streak: user.streak,
    coins: user.coins,
    role: user.role.toLowerCase() as 'student' | 'teacher' | 'admin',
    track: user.track ? (user.track.toLowerCase() as 'frontend' | 'robotics' | 'office') : null,
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

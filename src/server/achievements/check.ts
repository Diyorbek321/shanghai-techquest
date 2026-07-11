import { AchievementCondition } from '@prisma/client';
import { prisma } from '../db';
import { notify } from '../notifications/notify';

async function computeProgress(userId: string, conditionType: AchievementCondition): Promise<number> {
  switch (conditionType) {
    case 'FIRST_SUBMISSION':
    case 'SUBMISSIONS_COUNT':
      return prisma.submission.count({ where: { userId } });
    case 'MIDNIGHT_SUBMISSIONS': {
      const submissions = await prisma.submission.findMany({
        where: { userId, submittedAt: { not: null } },
        select: { submittedAt: true },
      });
      return submissions.filter((s) => s.submittedAt !== null && s.submittedAt.getHours() < 6).length;
    }
    case 'PROBLEM_SUBMISSIONS_PASSED':
      return prisma.problemSubmission.count({ where: { userId, passed: true } });
    case 'DIRECT_MESSAGES_SENT':
      return prisma.directMessage.count({ where: { senderId: userId } });
    case 'XP_REACHED': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } });
      return user?.xp ?? 0;
    }
    case 'LEVEL_REACHED': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { level: true } });
      return user?.level ?? 0;
    }
    case 'STREAK_REACHED': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { streak: true } });
      return user?.streak ?? 0;
    }
    case 'ELO_REACHED': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { eloRating: true } });
      return user?.eloRating ?? 0;
    }
    case 'COINS_BALANCE': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { coins: true } });
      return user?.coins ?? 0;
    }
    case 'BATTLES_WON':
      return prisma.battleChallenge.count({ where: { winnerId: userId } });
    case 'SHOP_ITEMS_OWNED':
      return prisma.userInventory.count({ where: { userId } });
    case 'FRIENDS_COUNT':
      return prisma.friendship.count({
        where: { status: 'ACCEPTED', OR: [{ requesterId: userId }, { addresseeId: userId }] },
      });
    case 'TEAM_JOINED': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { teamId: true } });
      return user?.teamId ? 1 : 0;
    }
    case 'QUESTS_COMPLETED':
      return prisma.userQuest.count({ where: { userId, completed: true } });
    case 'HOMEWORK_COMPLETED':
      return prisma.homework.count({ where: { userId, completed: true } });
    case 'GRADES_ABOVE_90': {
      const grades = await prisma.grade.findMany({ where: { userId }, select: { score: true, maxScore: true } });
      return grades.filter((g) => g.maxScore > 0 && g.score / g.maxScore >= 0.9).length;
    }
    default:
      return 0;
  }
}

/** Re-evaluates every achievement condition for a user and unlocks + notifies any newly met ones. */
export async function checkAchievements(userId: string): Promise<void> {
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({ where: { userId } });
  const stateByAchievement = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

  for (const achievement of achievements) {
    const existing = stateByAchievement.get(achievement.id);
    if (existing?.unlocked) continue;

    const progress = await computeProgress(userId, achievement.conditionType);
    const unlocked = progress >= achievement.conditionValue;

    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
      update: { progress, unlocked, unlockedAt: unlocked ? new Date() : null },
      create: { userId, achievementId: achievement.id, progress, unlocked, unlockedAt: unlocked ? new Date() : null },
    });

    if (unlocked) {
      await notify(prisma, {
        userId,
        type: 'SUCCESS',
        title: "Yangi yutuq qo'lga kiritildi!",
        body: `"${achievement.name}" yutug'ini qo'lga kiritdingiz.`,
      });
    }
  }
}

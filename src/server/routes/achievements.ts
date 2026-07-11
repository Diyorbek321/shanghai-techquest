import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';

export const achievementsRouter = Router();

achievementsRouter.use(requireAuth);

achievementsRouter.get('/', async (req, res) => {
  const [achievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { conditionValue: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId: req.user!.id } }),
  ]);

  const stateByAchievement = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

  res.json(
    achievements.map((a) => {
      const state = stateByAchievement.get(a.id);
      return {
        id: a.id,
        key: a.key,
        name: a.name,
        description: a.description,
        rarity: a.rarity,
        category: a.category,
        unlocked: state?.unlocked ?? false,
        unlockedAt: state?.unlockedAt ?? null,
        progress: state?.progress ?? 0,
        total: a.conditionValue,
      };
    })
  );
});

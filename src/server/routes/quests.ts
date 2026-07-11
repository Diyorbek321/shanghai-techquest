import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { toClientTrack } from '../serializers/track';
import { notify } from '../notifications/notify';
import { checkAchievements } from '../achievements/check';

export const questsRouter = Router();

questsRouter.use(requireAuth);

questsRouter.get('/', async (req, res) => {
  const track = req.user!.track;
  const quests = await prisma.quest.findMany({
    where: { OR: [{ track: null }, { track }] },
  });
  const userQuests = await prisma.userQuest.findMany({
    where: { userId: req.user!.id, questId: { in: quests.map((q) => q.id) } },
  });
  const byQuest = new Map(userQuests.map((uq) => [uq.questId, uq]));

  res.json(
    quests.map((q) => ({
      id: q.id,
      title: q.title,
      xpReward: q.xpReward,
      track: toClientTrack(q.track),
      chapterId: q.chapterId,
      completed: byQuest.get(q.id)?.completed ?? false,
      completedAt: byQuest.get(q.id)?.completedAt ?? null,
    }))
  );
});

questsRouter.post('/:id/complete', async (req, res) => {
  const quest = await prisma.quest.findUnique({ where: { id: req.params.id } });
  if (!quest) {
    return res.status(404).json({ error: 'Missiya topilmadi.' });
  }

  const existing = await prisma.userQuest.findUnique({
    where: { userId_questId: { userId: req.user!.id, questId: quest.id } },
  });
  if (existing?.completed) {
    return res.status(409).json({ error: 'Missiya allaqachon bajarilgan.' });
  }

  const [userQuest, user] = await prisma.$transaction([
    prisma.userQuest.upsert({
      where: { userId_questId: { userId: req.user!.id, questId: quest.id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId: req.user!.id, questId: quest.id, completed: true, completedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: req.user!.id },
      data: { xp: { increment: quest.xpReward } },
    }),
  ]);

  await notify(prisma, {
    userId: req.user!.id,
    type: 'SUCCESS',
    title: 'Missiya bajarildi!',
    body: `"${quest.title}" missiyasi uchun +${quest.xpReward} XP oldingiz.`,
  });

  await checkAchievements(req.user!.id);

  res.json({ userQuest, xp: user.xp });
});

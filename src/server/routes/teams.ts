import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth } from '../middleware/auth';
import { checkAchievements } from '../achievements/check';

export const teamsRouter = Router();

teamsRouter.use(requireAuth);

teamsRouter.get('/', async (req, res) => {
  const teams = await prisma.team.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      motto: t.motto,
      tag: t.tag,
      color: t.color,
      memberCount: t._count.members,
      isMine: t.id === req.user!.teamId,
    }))
  );
});

const createSchema = z.object({
  name: z.string().min(1).max(100),
  motto: z.string().max(200).optional(),
  tag: z.string().min(2).max(6),
  color: z.string().min(1),
});

teamsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  if (req.user!.teamId) {
    return res.status(409).json({ error: 'Siz allaqachon jamoadasiz.' });
  }

  const team = await prisma.team.create({ data: parsed.data });
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { teamId: team.id, teamRole: 'LEADER' },
  });
  await checkAchievements(req.user!.id);
  res.status(201).json(team);
});

teamsRouter.post('/:id/join', async (req, res) => {
  if (req.user!.teamId) {
    return res.status(409).json({ error: 'Siz allaqachon jamoadasiz.' });
  }
  const team = await prisma.team.findUnique({ where: { id: req.params.id } });
  if (!team) {
    return res.status(404).json({ error: 'Jamoa topilmadi.' });
  }
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { teamId: team.id, teamRole: 'MEMBER' },
  });
  await checkAchievements(req.user!.id);
  res.status(204).send();
});

teamsRouter.post('/leave', async (req, res) => {
  if (!req.user!.teamId) {
    return res.status(400).json({ error: 'Siz hech qanday jamoada emassiz.' });
  }
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { teamId: null, teamRole: null },
  });
  res.status(204).send();
});

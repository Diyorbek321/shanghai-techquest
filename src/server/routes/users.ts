import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { serializeUser } from '../serializers/user';
import { checkAchievements } from '../achievements/check';
import { TRACK_VALUES, toClientTrack, toPrismaTrack } from '../serializers/track';
import { avatarUrlForEmail } from '../avatar';
import { teacherManagesStudent } from '../utils/teacherScope';
import { generatePassword } from '../users/credentials';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/me', (req, res) => {
  res.json(serializeUser(req.user!));
});

// Admin-only user directory: create/list/update/remove staff and student accounts.
// Public /auth/register always creates STUDENT accounts, so this is the only
// way to provision TEACHER or ADMIN logins.
usersRouter.get('/', requireRole(Role.ADMIN), async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
    select: { id: true, email: true, name: true, role: true, track: true, createdAt: true, lastSeenAt: true },
  });
  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role.toLowerCase() as 'student' | 'teacher' | 'admin',
      track: toClientTrack(u.track),
      createdAt: u.createdAt,
      lastSeenAt: u.lastSeenAt,
    }))
  );
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(['student', 'teacher', 'admin']),
  track: z.enum(TRACK_VALUES).optional(),
});

usersRouter.post('/', requireRole(Role.ADMIN), async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { email, password, name, role, track } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Bu email bilan hisob allaqachon mavjud.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: role.toUpperCase() as Role,
      track: track ? toPrismaTrack(track) : null,
      title: role === 'student' ? 'New Recruit' : undefined,
      avatarUrl: avatarUrlForEmail(email),
    },
  });
  res.status(201).json(serializeUser(user));
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  theme: z.enum(['dark', 'neon', 'cyber']).optional(),
  audioEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  onlineVisible: z.boolean().optional(),
  profilePublic: z.boolean().optional(),
});

usersRouter.patch('/me', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { theme, ...rest } = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...rest,
      theme: theme ? (theme.toUpperCase() as 'DARK' | 'NEON' | 'CYBER') : undefined,
    },
  });
  res.json(serializeUser(user));
});

usersRouter.post('/me/heartbeat', async (req, res) => {
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { lastSeenAt: new Date() },
  });
  res.status(204).send();
});

const rewardSchema = z.object({
  xp: z.number().int().positive().optional(),
  coins: z.number().int().positive().optional(),
});

usersRouter.post('/me/reward', async (req, res) => {
  const parsed = rewardSchema.safeParse(req.body);
  if (!parsed.success || (!parsed.data.xp && !parsed.data.coins)) {
    return res.status(400).json({ error: "Musbat XP va/yoki tanga miqdorini kiriting." });
  }
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      xp: parsed.data.xp ? { increment: parsed.data.xp } : undefined,
      coins: parsed.data.coins ? { increment: parsed.data.coins } : undefined,
    },
  });
  await checkAchievements(req.user!.id);
  res.json(serializeUser(user));
});

const spendSchema = z.object({
  coins: z.number().int().positive(),
});

usersRouter.post('/me/spend', async (req, res) => {
  const parsed = spendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Musbat tanga miqdorini kiriting.' });
  }
  const { count } = await prisma.user.updateMany({
    where: { id: req.user!.id, coins: { gte: parsed.data.coins } },
    data: { coins: { decrement: parsed.data.coins } },
  });
  if (count === 0) {
    return res.status(409).json({ error: 'Tangalar yetarli emas.' });
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
  res.json(serializeUser(user));
});

// NOTE: these two must stay registered after every '/me*' route above —
// Express matches '/:id' against the literal segment 'me' too, so an
// earlier registration would hijack all /me requests for non-admins.
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  track: z.enum(TRACK_VALUES).nullable().optional(),
});

usersRouter.patch('/:id', requireRole(Role.ADMIN), async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { role, track, name } = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      name,
      role: role ? (role.toUpperCase() as Role) : undefined,
      track: track === undefined ? undefined : track ? toPrismaTrack(track) : null,
    },
  });
  res.json(serializeUser(user));
});

usersRouter.delete('/:id', requireRole(Role.ADMIN), async (req, res) => {
  if (req.params.id === req.user!.id) {
    return res.status(400).json({ error: "O'zingizni o'chira olmaysiz." });
  }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

/**
 * Issue a new password for a student who has lost theirs, and return it once —
 * the stored hash is one-way, so there is nothing to "look up" and a reset is
 * the only way back in.
 *
 * teacherManagesStudent() refuses any target that is not a STUDENT, which is
 * what stops a teacher from taking over a colleague's or an admin's account by
 * passing their id here.
 */
usersRouter.post('/:id/reset-password', requireRole(Role.TEACHER, Role.ADMIN), async (req, res) => {
  if (!(await teacherManagesStudent(req.user!, req.params.id))) {
    return res.status(403).json({ error: "Bu o'quvchining parolini tiklash huquqingiz yo'q." });
  }

  const password = generatePassword();
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  res.json({ id: user.id, name: user.name, login: user.email, password });
});

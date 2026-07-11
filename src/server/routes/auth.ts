import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role, Track } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { setAuthCookie, clearAuthCookie } from '../auth/cookies';
import { serializeUser } from '../serializers/user';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimit';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  track: z.enum(['frontend', 'robotics', 'office']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/register', authRateLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot kiritildi." });
  }
  const { email, password, name, track } = parsed.data;

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
      role: Role.STUDENT,
      track: track ? (track.toUpperCase() as Track) : null,
      title: 'New Recruit',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    },
  });

  const token = signToken({ sub: user.id, role: user.role, track: user.track });
  setAuthCookie(res, token);
  res.status(201).json(serializeUser(user));
});

authRouter.post('/login', authRateLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email yoki parol noto'g'ri." });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
  }
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
  }

  const token = signToken({ sub: user.id, role: user.role, track: user.track });
  setAuthCookie(res, token);
  res.json(serializeUser(user));
});

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(serializeUser(req.user!));
});

import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { verifyToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof loadUser>>>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

async function loadUser(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    const payload = verifyToken(token);
    const user = await loadUser(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
}

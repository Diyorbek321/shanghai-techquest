import { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function isSameOrigin(req: Request, origin: string): boolean {
  try {
    const originUrl = new URL(origin);
    return originUrl.host === req.get('host');
  } catch {
    return false;
  }
}

export function verifyOrigin(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');
  if (origin && !isSameOrigin(req, origin)) {
    res.status(403).json({ error: 'Cross-origin so\'rovga ruxsat berilmadi.' });
    return;
  }

  next();
}

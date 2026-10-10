import { createHash, timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../env';

/** Header Eduly's backend sends on every server-to-server call. */
export const SERVICE_TOKEN_HEADER = 'x-eduly-token';

/**
 * Compares digests rather than the raw strings so the comparison is
 * constant-time even when the lengths differ (timingSafeEqual throws on a
 * length mismatch, and an early length check would leak the secret's length).
 */
function secretsMatch(given: string, expected: string): boolean {
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function requireEdulyService(req: Request, res: Response, next: NextFunction): void {
  if (!env.edulySecret) {
    res.status(503).json({ error: 'Eduly integratsiyasi sozlanmagan.' });
    return;
  }
  const given = req.get(SERVICE_TOKEN_HEADER) ?? '';
  if (!given || !secretsMatch(given, env.edulySecret)) {
    res.status(401).json({ error: 'Invalid service token.' });
    return;
  }
  next();
}

export const SSO_ISSUER = 'eduly';
export const SSO_AUDIENCE = 'techquest';
/**
 * Eduly mints the token the instant the user taps the button and the browser
 * follows the link straight away, so a minute is generous. The limit is
 * enforced here as well as by `exp`, so a token minted with a long `exp` by a
 * misconfigured issuer is still refused.
 */
export const SSO_MAX_AGE_SECONDS = 120;

export interface SsoClaims {
  kind: 'student' | 'teacher';
  edulyId: number;
  jti: string;
  expiresAt: Date;
}

const SUBJECT = /^(student|teacher):([1-9]\d{0,9})$/;

/** Returns null for anything that is not a valid, unexpired Eduly SSO token. */
export function verifySsoToken(token: string): SsoClaims | null {
  if (!env.edulySecret) return null;
  try {
    const payload = jwt.verify(token, env.edulySecret, {
      algorithms: ['HS256'],
      issuer: SSO_ISSUER,
      audience: SSO_AUDIENCE,
      maxAge: `${SSO_MAX_AGE_SECONDS}s`,
    });
    if (typeof payload === 'string') return null;
    const match = SUBJECT.exec(payload.sub ?? '');
    if (!match || typeof payload.jti !== 'string' || !payload.jti || typeof payload.exp !== 'number') {
      return null;
    }
    return {
      kind: match[1] as 'student' | 'teacher',
      edulyId: Number(match[2]),
      jti: payload.jti,
      expiresAt: new Date(payload.exp * 1000),
    };
  } catch {
    return null;
  }
}

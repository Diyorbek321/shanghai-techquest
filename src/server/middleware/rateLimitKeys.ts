import type { Request } from 'express';
import { ipKeyGenerator } from 'express-rate-limit';
import { verifyToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';

/**
 * A whole class works from one school IP (one NAT), so a per-IP budget is
 * really a per-classroom budget: 25 students pressing "Run" exhaust it in a
 * minute and everyone gets 429. Signed-in requests are therefore counted per
 * user. Only a token that VERIFIES counts — a forged or expired cookie falls
 * back to the IP, so it cannot be used to mint fresh buckets.
 */
export function userOrIpKey(req: Request): string {
  const token: unknown = req.cookies?.[AUTH_COOKIE_NAME];
  if (typeof token === 'string' && token.length > 0) {
    try {
      return `user:${verifyToken(token).sub}`;
    } catch {
      // Invalid/expired session — count it against the IP below.
    }
  }
  return `ip:${ipKeyGenerator(req.ip ?? '')}`;
}

/**
 * Login/register from a shared school IP must not lock out the 11th student.
 * Keying on IP + e-mail still caps guessing against any single account, while
 * a separate looser per-IP limiter (see rateLimit.ts) caps spraying many
 * accounts from one address.
 */
export function ipAndEmailKey(req: Request): string {
  const raw: unknown = req.body?.email;
  const email = typeof raw === 'string' ? raw.trim().toLowerCase().slice(0, 254) : '';
  return `ip:${ipKeyGenerator(req.ip ?? '')}|email:${email}`;
}

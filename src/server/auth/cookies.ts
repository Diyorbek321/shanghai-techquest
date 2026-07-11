import { Response } from 'express';
import { env, expiresInToMs } from '../env';

export const AUTH_COOKIE_NAME = 'techquest_token';

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    maxAge: expiresInToMs(env.jwtExpiresIn),
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
}

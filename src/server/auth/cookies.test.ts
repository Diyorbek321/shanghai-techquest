import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { AUTH_COOKIE_NAME, setAuthCookie, clearAuthCookie } from './cookies';

function mockResponse(): Response {
  return {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  } as unknown as Response;
}

describe('setAuthCookie', () => {
  it('sets an httpOnly, sameSite=lax cookie with the configured name', () => {
    const res = mockResponse();
    setAuthCookie(res, 'a-token');

    expect(res.cookie).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      'a-token',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      })
    );
  });
});

describe('clearAuthCookie', () => {
  it('clears the auth cookie', () => {
    const res = mockResponse();
    clearAuthCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, { path: '/' });
  });
});

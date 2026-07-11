import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('expiresInToMs', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('converts seconds, minutes, hours, and days to milliseconds', async () => {
    const { expiresInToMs } = await import('./env');
    expect(expiresInToMs('30s')).toBe(30_000);
    expect(expiresInToMs('5m')).toBe(5 * 60_000);
    expect(expiresInToMs('2h')).toBe(2 * 3_600_000);
    expect(expiresInToMs('7d')).toBe(7 * 86_400_000);
  });

  it('falls back to 7 days for an unrecognized format', async () => {
    const { expiresInToMs } = await import('./env');
    expect(expiresInToMs('not-a-duration')).toBe(7 * 86_400_000);
  });
});

describe('env production guard', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('throws at import time when NODE_ENV=production and COOKIE_SECURE is not "true"', async () => {
    process.env.NODE_ENV = 'production';
    process.env.COOKIE_SECURE = 'false';
    process.env.JWT_SECRET = 'test-secret';

    await expect(import('./env')).rejects.toThrow(/COOKIE_SECURE must be "true"/);
  });

  it('does not throw when NODE_ENV=production and COOKIE_SECURE=true', async () => {
    process.env.NODE_ENV = 'production';
    process.env.COOKIE_SECURE = 'true';
    process.env.JWT_SECRET = 'test-secret';

    await expect(import('./env')).resolves.toBeDefined();
  });
});

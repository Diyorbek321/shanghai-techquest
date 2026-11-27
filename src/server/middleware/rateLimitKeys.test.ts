import { describe, expect, it } from 'vitest';
import type { Request } from 'express';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { ipAndEmailKey, userOrIpKey } from './rateLimitKeys';

function fakeReq(partial: { ip?: string; cookies?: Record<string, string>; body?: unknown }): Request {
  return { ip: '203.0.113.7', cookies: {}, body: {}, ...partial } as unknown as Request;
}

describe('userOrIpKey', () => {
  it('gives two signed-in students on the same school IP separate buckets', () => {
    const a = fakeReq({ cookies: { [AUTH_COOKIE_NAME]: signToken({ sub: 'student-a', role: 'STUDENT', track: null }) } });
    const b = fakeReq({ cookies: { [AUTH_COOKIE_NAME]: signToken({ sub: 'student-b', role: 'STUDENT', track: null }) } });
    expect(userOrIpKey(a)).toBe('user:student-a');
    expect(userOrIpKey(b)).toBe('user:student-b');
  });

  it('falls back to the IP for a forged cookie', () => {
    const req = fakeReq({ cookies: { [AUTH_COOKIE_NAME]: 'not-a-jwt' } });
    expect(userOrIpKey(req)).toBe('ip:203.0.113.7');
  });

  it('falls back to the IP when no cookie is present', () => {
    expect(userOrIpKey(fakeReq({}))).toBe('ip:203.0.113.7');
  });
});

describe('ipAndEmailKey', () => {
  it('separates different accounts on one IP but merges case variants of one', () => {
    const one = ipAndEmailKey(fakeReq({ body: { email: 'Ali@Example.com ' } }));
    const same = ipAndEmailKey(fakeReq({ body: { email: 'ali@example.com' } }));
    const other = ipAndEmailKey(fakeReq({ body: { email: 'vali@example.com' } }));
    expect(one).toBe(same);
    expect(one).not.toBe(other);
  });

  it('tolerates a missing or non-string email', () => {
    expect(ipAndEmailKey(fakeReq({ body: { email: 42 } }))).toBe('ip:203.0.113.7|email:');
    expect(ipAndEmailKey(fakeReq({ body: undefined }))).toBe('ip:203.0.113.7|email:');
  });
});

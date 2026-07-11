import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { signToken, verifyToken } from './jwt';

describe('signToken / verifyToken', () => {
  it('round-trips the payload', () => {
    const token = signToken({ sub: 'user-1', role: Role.STUDENT, track: null });
    const payload = verifyToken(token);

    expect(payload.sub).toBe('user-1');
    expect(payload.role).toBe(Role.STUDENT);
    expect(payload.track).toBeNull();
  });

  it('throws for a tampered token', () => {
    const token = signToken({ sub: 'user-1', role: Role.STUDENT, track: null });
    const tampered = `${token}tampered`;

    expect(() => verifyToken(tampered)).toThrow();
  });

  it('throws for a token signed with a different secret', () => {
    const foreignToken = jwt.sign({ sub: 'user-1', role: Role.STUDENT, track: null }, 'wrong-secret');

    expect(() => verifyToken(foreignToken)).toThrow();
  });
});

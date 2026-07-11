import jwt from 'jsonwebtoken';
import { Role, Track } from '@prisma/client';
import { env } from '../env';

export interface JwtPayload {
  sub: string;
  role: Role;
  track: Track | null;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

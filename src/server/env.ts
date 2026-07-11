function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured. Check your .env file.`);
  }
  return value;
}

const isProduction = process.env.NODE_ENV === 'production';
const cookieSecure = process.env.COOKIE_SECURE === 'true';

if (isProduction && !cookieSecure) {
  throw new Error('COOKIE_SECURE must be "true" when NODE_ENV=production.');
}

export const env = {
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecure,
  geminiApiKey: process.env.GEMINI_API_KEY,
};

export function expiresInToMs(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const unit = match[2];
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 86_400_000;
  return value * unitMs;
}

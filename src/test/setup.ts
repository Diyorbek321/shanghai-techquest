import 'dotenv/config';

process.env.JWT_SECRET ||= 'test-secret-do-not-use-in-production';
process.env.JWT_EXPIRES_IN ||= '7d';
process.env.COOKIE_SECURE ||= 'false';

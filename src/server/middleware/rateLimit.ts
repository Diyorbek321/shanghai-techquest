import rateLimit from 'express-rate-limit';
import { ipAndEmailKey, userOrIpKey } from './rateLimitKeys';

/** Per (IP, e-mail): caps password guessing against one account. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipAndEmailKey,
  message: { error: "Juda ko'p urinish qilindi. Birozdan so'ng qayta urinib ko'ring." },
});

/**
 * Per IP, deliberately loose: a full class signs in from one school address,
 * but this still stops one machine spraying hundreds of accounts.
 */
export const authIpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish qilindi. Birozdan so'ng qayta urinib ko'ring." },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
  message: { error: "Juda ko'p so'rov yuborildi. Birozdan so'ng qayta urinib ko'ring." },
});

// Code execution is far more expensive (compiles/spawns a sandboxed process
// per request) than a typical API call, so it gets its own tighter budget —
// per student, not per classroom.
export const runCodeRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
  message: { error: "Juda ko'p marta ishga tushirildi. Birozdan so'ng qayta urinib ko'ring." },
});

// A submit runs the code once per test case (up to 20 sandbox runs), so it is
// the most expensive call of all and must not ride only on the general limit.
export const submitCodeRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKey,
  message: { error: "Juda ko'p marta topshirildi. Birozdan so'ng qayta urinib ko'ring." },
});

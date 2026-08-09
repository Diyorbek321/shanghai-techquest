import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish qilindi. Birozdan so'ng qayta urinib ko'ring." },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov yuborildi. Birozdan so'ng qayta urinib ko'ring." },
});

// Code execution is far more expensive (compiles/spawns a sandboxed process
// per request) than a typical API call, so it gets its own tighter budget.
export const runCodeRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p marta ishga tushirildi. Birozdan so'ng qayta urinib ko'ring." },
});

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { setAuthCookie } from '../auth/cookies';
import { requireEdulyService, verifySsoToken } from '../integration/eduly/auth';
import { applySnapshot, snapshotSchema } from '../integration/eduly/sync';
import { progressReport } from '../integration/eduly/progress';

/**
 * Endpoints Eduly (the centre's management system) calls.
 *
 * Mounted ahead of the general /api stack: the service calls come from one
 * server IP every few minutes and would otherwise eat the per-IP budget meant
 * for browsers, and a full snapshot is larger than express.json()'s default.
 */
export const integrationRouter = Router();

// A whole class can tap "Dasturlash" at once from the school's single NAT
// address, so this cannot share the 10-per-15-minutes login limit. Each token
// is signed and single-use, so the limit is only there against floods.
const ssoRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish qilindi. Birozdan so'ng qayta urinib ko'ring." },
});

const service = Router();
service.use(requireEdulyService);
service.use(express.json({ limit: '10mb' }));

service.post('/sync', async (req, res) => {
  const parsed = snapshotSchema.safeParse(req.body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return res.status(400).json({ error: `${issue?.path.join('.')}: ${issue?.message}` });
  }
  try {
    const report = await applySnapshot(prisma, parsed.data);
    if (report.warnings.length) {
      console.warn('[eduly-sync]', JSON.stringify(report.warnings));
    }
    res.json(report);
  } catch (error) {
    console.error('[eduly-sync] failed', error);
    res.status(500).json({ error: 'Sinxronlash muvaffaqiyatsiz tugadi.' });
  }
});

service.get('/progress', async (_req, res) => {
  try {
    res.json({ generatedAt: new Date().toISOString(), students: await progressReport(prisma) });
  } catch (error) {
    console.error('[eduly-progress] failed', error);
    res.status(500).json({ error: "Progressni hisoblab bo'lmadi." });
  }
});

integrationRouter.use('/eduly', service);

/**
 * The browser lands here from Eduly with a token minted a moment ago. Success
 * sets the normal session cookie and drops the user on the home screen; every
 * failure goes to the sign-in screen with a reason, never a JSON page a child
 * would not know what to do with.
 */
integrationRouter.get('/eduly-sso', ssoRateLimiter, async (req, res) => {
  const fail = (reason: string) => res.redirect(303, `/?sso_error=${reason}`);
  try {
    await ssoLogin(req, res, fail);
  } catch (error) {
    console.error('[eduly-sso] failed', error);
    fail('server');
  }
});

async function ssoLogin(req: express.Request, res: express.Response, fail: (reason: string) => void) {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const claims = token ? verifySsoToken(token) : null;
  if (!claims) return fail('invalid');

  try {
    // Spending the nonce first, in its own insert, makes a replay fail on the
    // primary key even if two requests carrying the same token arrive at once.
    await prisma.ssoNonce.create({ data: { jti: claims.jti, expiresAt: claims.expiresAt } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return fail('used');
    }
    throw error;
  }
  await prisma.ssoNonce.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  const user = await prisma.user.findUnique({
    where: claims.kind === 'student' ? { edulyStudentId: claims.edulyId } : { edulyTeacherId: claims.edulyId },
  });
  if (!user) return fail('unknown');
  if (user.disabledAt) return fail('disabled');

  setAuthCookie(res, signToken({ sub: user.id, role: user.role, track: user.track }));
  res.redirect(303, '/');
}

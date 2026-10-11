import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes';
import { mountDevMiddleware, mountProdStatic } from './viteDev';
import { apiRateLimiter } from './middleware/rateLimit';
import { verifyOrigin } from './middleware/csrf';
import { integrationRouter } from './routes/integration';
import { liveRouter } from './routes/live';

export function createApp(): express.Express {
  const app = express();

  // Before express.json(): an Eduly snapshot is larger than its 100kb default,
  // and the service calls must not draw on the browser rate limit below.
  app.use('/api/integration', integrationRouter);

  app.use(express.json());
  app.use(cookieParser());

  // Ahead of the per-IP limiter: a whole class plays from one school IP, so
  // the live quiz is rate-limited per user inside its own router instead.
  app.use('/api/live', verifyOrigin, liveRouter);
  app.use('/api', verifyOrigin, apiRateLimiter, apiRouter);

  return app;
}

export async function startServer(): Promise<void> {
  const app = createApp();
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    await mountDevMiddleware(app);
  } else {
    mountProdStatic(app);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

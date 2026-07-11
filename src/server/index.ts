import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes';
import { mountDevMiddleware, mountProdStatic } from './viteDev';
import { apiRateLimiter } from './middleware/rateLimit';
import { verifyOrigin } from './middleware/csrf';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

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

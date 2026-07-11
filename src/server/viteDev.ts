import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

export async function mountDevMiddleware(app: Express): Promise<void> {
  // Resolved lazily (not at module load) so the esbuild CJS production bundle,
  // where import.meta.url is unavailable, never evaluates this dev-only path.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, '..', '..'),
  });
  app.use(vite.middlewares);
}

export function mountProdStatic(app: Express): void {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

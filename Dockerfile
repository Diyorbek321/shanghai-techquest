# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching). package.json's
# postinstall runs `prisma generate`, so the schema must be present.
COPY package.json package-lock.json ./
COPY prisma ./prisma

# DNS inside the build container resolves the registry to IPv6 first, and that
# path stalls partway through large tarball reads: small requests succeed but
# `npm ci` dies with ETIMEDOUT / errno -110 after several minutes. Preferring
# IPv4 fixes it; the raised timeout and retry budget keep a slow-but-working
# link from failing the build. Drop these if the host network stops needing it.
ENV NODE_OPTIONS=--dns-result-order=ipv4first
RUN npm ci --no-audit --no-fund \
      --fetch-timeout=600000 \
      --fetch-retries=6 \
      --fetch-retry-maxtimeout=120000

# Copy the rest of the source and build the client (Vite) + server (esbuild)
# bundle. `npm run build` outputs static assets and dist/server.cjs into dist/.
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
# Lesson slide decks are served by GET /api/lessons/:key/slides.
COPY --from=build /app/lesson-assets ./lesson-assets

# Maintenance scripts (scripts/seedBackendCourse.ts, scripts/dedupeClasses.ts)
# run inside this container against the live database — `docker compose exec app
# npx tsx scripts/...`. They import from src/ and prisma/, and tsx is already
# present because the runtime copies node_modules wholesale from the build stage
# (devDependencies included). Together this is ~1.5 MB of source text.
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./tsconfig.json

# server.ts hardcodes PORT = 3000 and binds to 0.0.0.0.
EXPOSE 3000

# Apply pending Prisma migrations, then start the built server.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.cjs"]

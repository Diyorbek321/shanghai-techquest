# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching). package.json's
# postinstall runs `prisma generate`, so the schema must be present.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

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

# server.ts hardcodes PORT = 3000 and binds to 0.0.0.0.
EXPOSE 3000

# Apply pending Prisma migrations, then start the built server.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.cjs"]

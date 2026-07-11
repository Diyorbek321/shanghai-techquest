# Shanghai TechQuest

A gamified learning management system (LMS) combining education and gameplay. Students learn programming, robotics, and office skills through quests, battles, achievements, and social competition on a personal city-building platform.

**Live Platform:** Three learning tracks (Frontend Web Development, Robotics Engineering, Office Productivity) with synchronized progression, PvP coding arenas, AI mentor assistance, and a comprehensive grading/attendance system for teachers.

## Tech Stack

**Frontend:**
- React 19 + Vite (fast development & production builds)
- Tailwind CSS 4 + TypeScript
- Three.js + React Three Fiber (3D city building visualization)
- Monaco Editor (code editing)
- TanStack React Query (data fetching & caching)
- Lucide React (icons)
- Motion (animations)

**Backend:**
- Express.js + Node.js
- Prisma ORM (database queries)
- JWT authentication (httpOnly cookies)
- bcryptjs (password hashing)

**Database:**
- PostgreSQL 16 (via Docker)

**AI Integration:**
- Google Generative AI / Gemini API (AI mentor chat)

**Validation:**
- Zod (runtime schema validation)

## Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **Docker & Docker Compose** (for PostgreSQL database)
- **Google Gemini API Key** (for AI mentor feature) — get one at [ai.google.dev](https://ai.google.dev)

## Local Setup

### 1. Clone Repository
```bash
git clone <repo-url>
cd shanghai-techquest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
```bash
# Start PostgreSQL via Docker
docker compose up -d postgres

# Run migrations to create tables
npx prisma migrate dev

# Seed database with demo data (users, classes, assignments, achievements, etc.)
npm run db:seed
```

### 4. Configure Environment Variables
```bash
# Copy example to local config
cp .env.example .env.local

# Edit .env.local with required values
```

Set these variables in `.env.local`:
- `GEMINI_API_KEY` — Your Google Generative AI key
- `JWT_SECRET` — A strong random string (e.g., `openssl rand -hex 32`)
- `COOKIE_SECURE` — `false` for local dev, `true` in production
- `NODE_ENV` — `development` for local, `production` for deployment

See [Environment Variables](#environment-variables) table below for all options.

### 5. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

**Demo Accounts** (from seed data):
- Teacher: `teacher@techquest.dev` / `password123`
- Admin: `admin@techquest.dev` / `password123`
- Student (Frontend): `frontend@techquest.dev` / `password123`
- Student (Robotics): `robotics@techquest.dev` / `password123`
- Student (Office): `office@techquest.dev` / `password123`

### 6. (Optional) Explore Database GUI
```bash
npx prisma studio
```
Opens Prisma Studio at `http://localhost:5555` for visual database browsing.

## Environment Variables

| Variable | Required? | Default | Purpose |
|----------|-----------|---------|---------|
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key for AI mentor chatbot |
| `DATABASE_URL` | Yes | — | PostgreSQL connection: `postgresql://user:password@localhost:5435/techquest` |
| `JWT_SECRET` | Yes | — | Secret key for signing JWT tokens (use random 32+ char string) |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration (e.g., `7d`, `24h`, `30m`) |
| `COOKIE_SECURE` | No | `false` | Set `true` in production; enables secure (HTTPS-only) cookies |
| `NODE_ENV` | No | `development` | Environment mode: `development` or `production` |

## Available npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with hot reload (port 3000) |
| `npm run build` | Build frontend (Vite) + backend (esbuild) for production |
| `npm run start` | Run production build (`dist/server.cjs`) |
| `npm run clean` | Remove build artifacts (`dist/`, `server.js`) |
| `npm run lint` | Type-check TypeScript (no emit) |
| `npm run db:migrate` | Create & run Prisma migrations |
| `npm run db:seed` | Populate database with demo data |
| `npm run db:studio` | Launch Prisma Studio (visual DB editor) |

## High-Level Architecture

```
Client (React 19 + Vite)
    ↓
Express Server (port 3000)
    ├── Static: index.html, assets (Vite SPA)
    └── API Router: /api/*
        ├── /auth (login, register, logout)
        ├── /users (profiles, settings)
        ├── /classes (class groups, enrollments)
        ├── /assignments (assignments, deadlines)
        ├── /submissions (student work)
        ├── /grades (academic scores)
        ├── /homework (homework tracking)
        ├── /attendance (class attendance)
        ├── /notifications (notifications)
        ├── /calendar (calendar events)
        ├── /quests (missions, progression)
        ├── /progress (module unlock tracking)
        ├── /city (3D city buildings)
        ├── /achievements (achievement tracking)
        ├── /leaderboard (rankings by XP, ELO)
        ├── /shop (cosmetics & boosts)
        ├── /teams (guilds/teams)
        ├── /problems (coding challenge library)
        ├── /battles (PvP code battles)
        ├── /mentor (AI chat)
        └── /social (friendships, DMs)
    ↓
Prisma ORM (TypeScript type-safe queries)
    ↓
PostgreSQL Database
    └── Tables: users, classes, assignments, submissions, grades,
        quests, achievements, problems, battles, chat, teams, etc.
```

## Authentication & Security

- **JWT Tokens:** Stored in httpOnly cookies (automatically sent with requests, immune to XSS)
- **Cookie Security:** `COOKIE_SECURE=true` in production forces HTTPS-only transmission
- **Password Hashing:** bcryptjs with 10 salt rounds
- **Input Validation:** Zod schemas on API endpoints

## Data Model Highlights

**Users:**
- Three roles: STUDENT, TEACHER, ADMIN
- Three tracks (for students): FRONTEND, ROBOTICS, OFFICE
- Progression: level, XP, coins, streak, ELO rating
- Settings: theme (DARK/NEON/CYBER), audio toggle, online visibility

**Education:**
- Classes (with teacher, schedule, track)
- Assignments (with due dates, XP rewards)
- Submissions (with status: PENDING/SUBMITTED/GRADED/LATE)
- Grades (scores per subject/assignment)
- Attendance (status: PRESENT/ABSENT/LATE/EXCUSED)
- Homework (independent tasks per track)

**Gamification:**
- Quests (missions with XP rewards, track-specific or universal)
- Achievements (50+ condition-based unlocks: PROGRAMMING, SPEED, SOCIAL, SPECIAL, SECRET)
- Shop (cosmetics: frames, themes, boosts; materials & building upgrades)
- City Building (3D voxel grid with themed structures)
- Battles (PvP coding challenges with ELO ranking)
- Leaderboard (XP & ELO based)
- Teams (guilds with motto, tag, color)

**Social:**
- Friendships (request → PENDING → ACCEPTED/DECLINED)
- Direct Messages (user-to-user chat)
- AI Mentor (Gemini-powered chatbot)

## Troubleshooting

**Port 3000 already in use?**
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Database connection fails?**
```bash
# Check if postgres container is running
docker ps | grep postgres

# If not, restart
docker compose up -d postgres

# Check logs
docker compose logs postgres
```

**Prisma schema out of sync?**
```bash
# Reset database and re-run migrations
npx prisma migrate reset
npm run db:seed
```

**TypeScript errors?**
```bash
# Regenerate Prisma client
npx prisma generate
```

## Related Documentation

- **Prisma Schema:** `prisma/schema.prisma` — Database structure & relationships
- **Seed Data:** `prisma/seed.ts` — Demo users, classes, assignments, achievements
- **Server Entry:** `server.ts` → `src/server/index.ts` — Express bootstrap
- **API Routes:** `src/server/routes/index.ts` — All endpoint registration
- **Frontend Entry:** `src/main.tsx` → `src/App.tsx` — React SPA mount point

## Contributing

1. Check TypeScript: `npm run lint`
2. Run locally: `npm run dev`
3. Follow existing patterns in component/API structure
4. Test with demo seed accounts before committing

## License

Proprietary — Shanghai TechQuest

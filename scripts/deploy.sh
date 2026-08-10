#!/usr/bin/env bash
#
# Deploy this app on the server it runs on. Run it ON the server, as root.
#
#   bash scripts/deploy.sh                     # full deploy + backend course
#   SKIP_SEED=1 bash scripts/deploy.sh         # deploy only, leave content alone
#   START=2026-09-01 bash scripts/deploy.sh    # cohort start date for the course
#
# The production host runs the app under Docker Compose in /opt/shanghai-techquest
# (nginx proxies techquest.shanghai-edu.uz to 127.0.0.1:3000). The app container's
# CMD is `prisma migrate deploy && node dist/server.cjs`, so migrations are applied
# by the restart itself — this script must not run them separately.
#
# The deployment directory was originally populated by hand rather than by git.
# The first run therefore converts it into a checkout: `git init` + fetch + hard
# reset onto origin/main. A hard reset overwrites tracked files but never touches
# untracked ones, so the server's .env survives. Anything else the server has
# modified by hand would NOT survive, which is why the directory is archived
# before that happens.
#
# Everything up to the reset is read-only, and both backups are taken first, so
# an abort in the early steps leaves the running site untouched.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/shanghai-techquest}"
REPO="${REPO:-https://github.com/Diyorbek321/shanghai-techquest.git}"
BRANCH="${BRANCH:-main}"
BACKUP_DIR="${BACKUP_DIR:-/opt/backups}"
TEACHER_EMAIL="${TEACHER_EMAIL:-teacher@techquest.dev}"
LESSON_DAYS="${LESSON_DAYS:-1,3,5}"
SKIP_SEED="${SKIP_SEED:-}"
START="${START:-}"

STAMP="$(date +%Y%m%d-%H%M%S)"
step() { printf '\n=== %s\n' "$1"; }

step "1/8  Tekshiruv"
command -v docker >/dev/null || { echo "XATO: docker topilmadi."; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "XATO: 'docker compose' plagini yo'q."; exit 1; }
[ -d "$APP_DIR" ] || { echo "XATO: $APP_DIR topilmadi."; exit 1; }
cd "$APP_DIR"
[ -f docker-compose.yml ] || { echo "XATO: $APP_DIR/docker-compose.yml yo'q."; exit 1; }
[ -f .env ] || { echo "XATO: $APP_DIR/.env yo'q — DATABASE_URL va JWT_SECRET shundan olinadi."; exit 1; }
echo "papka: $APP_DIR | shoxobcha: $BRANCH"

step "2/8  Zaxira"
mkdir -p "$BACKUP_DIR"
DB_BACKUP="$BACKUP_DIR/techquest-db-$STAMP.sql.gz"
docker compose exec -T postgres pg_dump -U techquest techquest | gzip > "$DB_BACKUP"
# A pg_dump that failed mid-stream still leaves a small, valid-looking .gz, so the
# size is checked rather than trusted. Under 1 KB means the dump did not happen.
DB_SIZE=$(stat -c %s "$DB_BACKUP")
[ "$DB_SIZE" -gt 1024 ] || { echo "XATO: baza zaxirasi juda kichik ($DB_SIZE bayt) — to'xtatildi."; exit 1; }
echo "baza:  $DB_BACKUP ($(du -h "$DB_BACKUP" | cut -f1))"

FILES_BACKUP="$BACKUP_DIR/techquest-files-$STAMP.tar.gz"
tar --exclude=node_modules --exclude=.git --exclude=dist -czf "$FILES_BACKUP" -C "$APP_DIR" .
echo "fayl:  $FILES_BACKUP ($(du -h "$FILES_BACKUP" | cut -f1))"

step "3/8  Kodni yangilash"
if [ ! -d .git ]; then
  echo "git repozitoriysi emas — checkout'ga aylantirilmoqda"
  git init -q
fi
# The deployment directory is not owned by root, and git refuses to operate on a
# repository owned by another user unless it is listed as safe. Registered before
# any other git command, because even `git remote add` trips the check. The guard
# keeps repeated deploys from appending the same entry to ~/.gitconfig forever.
git config --global --get-all safe.directory 2>/dev/null | grep -qxF "$APP_DIR" \
  || git config --global --add safe.directory "$APP_DIR"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi
git fetch -q origin "$BRANCH"
echo "o'zgaradigan fayllar:"
git diff --stat "origin/$BRANCH" -- . | tail -5 || true
git reset -q --hard "origin/$BRANCH"
git log -1 --format='hozirgi commit: %h %ad %s' --date=short

step "4/8  Image qurish"
docker compose build app

step "5/8  Ishga tushirish (migratsiyalar konteyner CMD'sida qo'llanadi)"
docker compose up -d app

step "6/8  Sog'liqni kutish"
for i in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:3000/; then
    echo "javob berdi ($i s)"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "XATO: 60 soniyada javob bermadi. Loglar:"
    docker compose logs --tail 40 app
    exit 1
  fi
  sleep 1
done

step "7/8  Python Backend kursi"
if [ -n "$SKIP_SEED" ]; then
  echo "SKIP_SEED o'rnatilgan — o'tkazib yuborildi."
else
  SEED_ARGS=(--apply --teacher "$TEACHER_EMAIL" --days "$LESSON_DAYS")
  [ -n "$START" ] && SEED_ARGS+=(--start "$START")
  docker compose exec -T app npx tsx scripts/seedBackendCourse.ts "${SEED_ARGS[@]}"
fi

step "8/8  Parsons mashqlari (qatorlarni tartiblash)"
if [ -n "$SKIP_SEED" ]; then
  echo "SKIP_SEED o'rnatilgan — o'tkazib yuborildi."
else
  # Runs INSIDE the app container so PISTON_URL resolves to the compose network.
  # Every reference solution is executed against its problem's own test cases;
  # a failure exits non-zero and is surfaced rather than swallowed, because a
  # Parsons exercise built from wrong code teaches the wrong structure.
  docker compose exec -T app npx tsx scripts/addParsonsSolutions.ts --apply \
    || echo "OGOHLANTIRISH: ba'zi yechimlar tekshiruvdan o'tmadi — yuqoridagi ro'yxatga qarang."
fi

step "Yakuniy holat"
docker compose ps app
echo
echo "Zaxiralar:"
echo "  $DB_BACKUP"
echo "  $FILES_BACKUP"
echo
echo "Qaytarish kerak bo'lsa:"
echo "  gunzip -c $DB_BACKUP | docker compose exec -T postgres psql -U techquest -d techquest"

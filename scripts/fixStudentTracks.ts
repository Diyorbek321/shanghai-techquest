/**
 * Repair students whose `track` disagrees with the cohort they are enrolled in.
 *
 * A student's track is written exactly once — when the account is created, from
 * the track of the class it was created in (src/server/routes/classes.ts) — and
 * nothing has ever updated it since. Two things left it wrong:
 *
 *   1. The BACKEND track only exists from the 2026-08-01 migration. Backend
 *      students registered before that could only be put in a FRONTEND cohort,
 *      and their track froze there.
 *   2. The "new class" form used to default its track dropdown to 'frontend',
 *      so a teacher who never opened it produced a frontend cohort whose
 *      students inherited frontend.
 *
 * The track is what puts a course in the sidebar (src/components/Layout.tsx) and
 * what scopes the class and assignment lists (src/server/utils/trackScope.ts), so
 * a wrong one means the student reads someone else's curriculum and never sees
 * their own cohort.
 *
 * The enrolled class is treated as the truth. Students enrolled in cohorts on
 * two different tracks are reported and skipped — there is no single right
 * answer for them, and guessing would move somebody onto the wrong course a
 * second time. Fix those individually in Admin -> Foydalanuvchilar.
 *
 * Run with `--apply` to write; without it the script only reports.
 *
 * Usage:
 *   npx tsx scripts/fixStudentTracks.ts            # report only
 *   npx tsx scripts/fixStudentTracks.ts --apply    # write
 */
import { PrismaClient, Role, Track } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

interface Repair {
  id: string;
  name: string;
  email: string;
  from: Track | null;
  to: Track;
  className: string;
}

interface Ambiguous {
  name: string;
  email: string;
  track: Track | null;
  tracks: Track[];
}

async function buildPlan(): Promise<{ repairs: Repair[]; ambiguous: Ambiguous[]; unenrolled: number }> {
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    select: {
      id: true,
      name: true,
      email: true,
      track: true,
      enrollments: { select: { class: { select: { title: true, track: true } } } },
    },
    orderBy: { name: 'asc' },
  });

  const repairs: Repair[] = [];
  const ambiguous: Ambiguous[] = [];
  let unenrolled = 0;

  for (const student of students) {
    const classes = student.enrollments.map((e) => e.class);
    if (classes.length === 0) {
      unenrolled += 1;
      continue;
    }

    const tracks = [...new Set(classes.map((c) => c.track))];
    if (tracks.length > 1) {
      ambiguous.push({ name: student.name, email: student.email, track: student.track, tracks });
      continue;
    }

    const [correct] = tracks;
    if (student.track === correct) continue;

    repairs.push({
      id: student.id,
      name: student.name,
      email: student.email,
      from: student.track,
      to: correct,
      className: classes[0].title,
    });
  }

  return { repairs, ambiguous, unenrolled };
}

async function main() {
  const { repairs, ambiguous, unenrolled } = await buildPlan();

  console.log(`tuzatish kerak: ${repairs.length} ta o'quvchi`);
  for (const r of repairs) {
    console.log(`  ${r.name} <${r.email}>  ${r.from ?? 'yo\'q'} -> ${r.to}   [${r.className}]`);
  }

  if (ambiguous.length > 0) {
    console.log(`\nqo'lda hal qilinadi (bir nechta yo'nalishdagi sinflarda): ${ambiguous.length}`);
    for (const a of ambiguous) {
      console.log(`  ${a.name} <${a.email}>  hozirgi: ${a.track ?? 'yo\'q'}  sinflar: ${a.tracks.join(', ')}`);
    }
  }
  if (unenrolled > 0) {
    console.log(`\nhech qaysi sinfda emas, o'tkazib yuborildi: ${unenrolled}`);
  }

  if (repairs.length === 0) {
    console.log('\ntuzatiladigan yozuv yo\'q.');
    return;
  }
  if (!APPLY) {
    console.log('\n(quruq ishga tushirish — yozilmadi. Yozish uchun: --apply)');
    return;
  }

  // Grouped by target track so this is a handful of updateMany calls rather than
  // one round trip per student.
  const byTrack = new Map<Track, string[]>();
  for (const r of repairs) {
    byTrack.set(r.to, [...(byTrack.get(r.to) ?? []), r.id]);
  }

  const updated = await prisma.$transaction(async (tx) => {
    let total = 0;
    for (const [track, ids] of byTrack) {
      const { count } = await tx.user.updateMany({ where: { id: { in: ids } }, data: { track } });
      total += count;
    }
    return total;
  });

  console.log(`\nbajarildi. yangilangan o'quvchilar: ${updated}`);
  // requireAuth re-reads the user from the database on every request, so the
  // session cookie's stale track claim is never consulted — no re-login needed,
  // only a page refresh to refetch /users/me on the client.
  console.log("o'quvchilar sahifani yangilagach to'g'ri kursni ko'radi (qayta login shart emas).");
}

main()
  .catch((e) => {
    console.error('XATO:', e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

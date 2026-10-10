/**
 * Link TechQuest records that existed before the Eduly integration to their
 * Eduly ids, once, by hand.
 *
 * The sync links a hand-enrolled student automatically when the name matches
 * uniquely inside a cohort that is already linked — but it never guesses which
 * hand-made cohort an Eduly group is, because two cohorts called "Python 1"
 * are common. So the order is: link the cohorts here, then let the next sync
 * pick up their students.
 *
 *   npx tsx scripts/edulyLink.ts list
 *   npx tsx scripts/edulyLink.ts class   <classId>          <edulyGroupId>
 *   npx tsx scripts/edulyLink.ts student <userId|login>     <edulyStudentId>
 *   npx tsx scripts/edulyLink.ts teacher <userId|login>     <edulyTeacherId>
 *   npx tsx scripts/edulyLink.ts unlink-class <classId>
 *
 * In the production container: docker compose exec app npx tsx scripts/edulyLink.ts list
 */
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

function usage(): never {
  console.error('Usage: edulyLink.ts list | class <classId> <edulyGroupId> | student <user> <id> | teacher <user> <id> | unlink-class <classId>');
  process.exit(2);
}

function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) usage();
  return id;
}

async function findUser(ref: string) {
  const user = await prisma.user.findFirst({ where: { OR: [{ id: ref }, { email: ref }] } });
  if (!user) throw new Error(`Foydalanuvchi topilmadi: ${ref}`);
  return user;
}

async function list() {
  const classes = await prisma.classGroup.findMany({
    include: { teacher: { select: { name: true } }, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'asc' },
  });
  console.log('SINFLAR (id | eduly | yo\'nalish | ustoz | o\'quvchilar | nom)');
  for (const c of classes) {
    console.log(
      [c.id, c.edulyGroupId ?? '-', c.track, c.teacher.name, c._count.enrollments, c.title].join(' | ')
    );
  }
  const teachers = await prisma.user.findMany({ where: { role: Role.TEACHER }, orderBy: { name: 'asc' } });
  console.log('\nUSTOZLAR (id | eduly | login | ism)');
  for (const t of teachers) console.log([t.id, t.edulyTeacherId ?? '-', t.email, t.name].join(' | '));
}

async function main() {
  const [command, a, b] = process.argv.slice(2);
  switch (command) {
    case 'list':
      return list();
    case 'class': {
      if (!a) usage();
      const cls = await prisma.classGroup.update({ where: { id: a }, data: { edulyGroupId: parseId(b) } });
      return console.log(`OK: "${cls.title}" -> eduly guruh #${cls.edulyGroupId}`);
    }
    case 'unlink-class': {
      if (!a) usage();
      const cls = await prisma.classGroup.update({ where: { id: a }, data: { edulyGroupId: null } });
      return console.log(`OK: "${cls.title}" Eduly'dan uzildi`);
    }
    case 'student':
    case 'teacher': {
      if (!a) usage();
      const user = await findUser(a);
      const id = parseId(b);
      const data = command === 'student' ? { edulyStudentId: id } : { edulyTeacherId: id };
      await prisma.user.update({ where: { id: user.id }, data });
      return console.log(`OK: ${user.name} (${user.email}) -> eduly ${command} #${id}`);
    }
    default:
      usage();
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

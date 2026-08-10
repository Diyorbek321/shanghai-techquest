/**
 * Store verified reference solutions so problems gain a Parsons (line-ordering)
 * variant.
 *
 * The verification is the whole point. A Parsons exercise is built by shuffling
 * the lines of the stored solution, so a wrong solution does not produce a
 * broken exercise — it produces a working exercise that teaches the wrong
 * structure, and the student is graded as correct for reproducing it. That is
 * worse than having no exercise. Every solution is therefore executed against
 * the problem's OWN stored test cases through the real code runner, and only
 * the ones that pass are written.
 *
 * Requires Piston to be reachable (PISTON_URL, default http://127.0.0.1:2000).
 *
 * Usage:
 *   npx tsx scripts/addParsonsSolutions.ts            # verify only, write nothing
 *   npx tsx scripts/addParsonsSolutions.ts --apply
 */
import { PrismaClient } from '@prisma/client';
import { backendParsonsSolutions } from '../prisma/lessonsData/backendSolutions';
import { judgeSubmission, parseTestCases } from '../src/server/code/judge';
import { PistonUnavailableError } from '../src/server/code/piston';
import { toLines } from '../src/server/parsons/blocks';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

/** Fewer than two lines cannot be shuffled, so there is no exercise to offer. */
const MIN_LINES = 2;

interface Outcome {
  key: string;
  status: 'ok' | 'fail' | 'missing' | 'too-short' | 'no-tests';
  detail: string;
}

async function verify(record: { key: string; solutionPy: string }): Promise<Outcome> {
  const problem = await prisma.problem.findUnique({
    where: { key: record.key },
    select: { id: true, title: true, testCases: true },
  });
  if (!problem) return { key: record.key, status: 'missing', detail: 'masala bazada topilmadi' };

  const lines = toLines(record.solutionPy);
  if (lines.length < MIN_LINES) {
    return { key: record.key, status: 'too-short', detail: `${lines.length} qator — aralashtirib bo'lmaydi` };
  }

  const testCases = parseTestCases(problem.testCases);
  if (testCases.length === 0) {
    return { key: record.key, status: 'no-tests', detail: 'masalada test yo\'q, tekshirib bo\'lmaydi' };
  }

  const judged = await judgeSubmission('python', record.solutionPy, testCases);
  if (!judged.passed) {
    const failed = judged.results.find((r) => !r.passed);
    return {
      key: record.key,
      status: 'fail',
      detail: `${judged.testsPassed}/${judged.testsTotal} test o'tdi${
        failed ? ` — "${failed.label}": kutilgan ${JSON.stringify(failed.expected ?? '')}, olingan ${JSON.stringify(failed.actual ?? '')}` : ''
      }`,
    };
  }

  if (APPLY) {
    await prisma.problem.update({ where: { id: problem.id }, data: { solutionPy: record.solutionPy } });
  }
  return { key: record.key, status: 'ok', detail: `${judged.testsTotal} test o'tdi, ${lines.length} qator` };
}

async function main() {
  console.log(`Tekshiriladigan yechimlar: ${backendParsonsSolutions.length}`);
  console.log(APPLY ? 'Rejim: YOZISH (--apply)\n' : 'Rejim: faqat tekshirish (yozish uchun --apply)\n');

  const outcomes: Outcome[] = [];
  for (const record of backendParsonsSolutions) {
    // Sequential on purpose: the code runner is a shared single service and a
    // burst of parallel executions is how it starts timing out.
    outcomes.push(await verify(record));
    const last = outcomes[outcomes.length - 1];
    const mark = last.status === 'ok' ? 'OK  ' : 'XATO';
    console.log(`  ${mark} ${last.key} — ${last.detail}`);
  }

  const ok = outcomes.filter((o) => o.status === 'ok');
  const bad = outcomes.filter((o) => o.status !== 'ok');
  console.log(`\nO'tdi: ${ok.length} | O'tmadi: ${bad.length}`);

  if (APPLY) {
    const total = await prisma.problem.count({ where: { solutionPy: { not: null } } });
    console.log(`Bazada Parsons mashqi bor masalalar: ${total}`);
  }

  // A failing solution is a content bug that must be fixed, not skipped: exiting
  // non-zero keeps it from passing quietly through a deploy script.
  if (bad.length > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    if (e instanceof PistonUnavailableError) {
      console.error("XATO: kod ishga tushiruvchi (Piston) javob bermadi — PISTON_URL ni tekshiring.");
    } else {
      console.error('XATO:', e.message);
    }
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

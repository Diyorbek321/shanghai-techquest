/**
 * Runs every "Kod nima chiqaradi?" snippet on a real Python and checks that it
 * prints exactly the stored `expectedOutput`. A question whose answer key is
 * wrong would mark right answers wrong — so nothing is published unverified.
 *
 *   npx tsx scripts/verifyOutputQuestions.ts               # uses python3.10
 *   PYTHON=/path/to/python3.10 npx tsx scripts/verifyOutputQuestions.ts
 *   npx tsx scripts/verifyOutputQuestions.ts --lesson backend-dars-04
 *
 * Python 3.10 on purpose: it is Piston's version, and 3.12+ accepts syntax
 * (same-quote nested f-strings) that 3.10 rejects. Each snippet runs in its own
 * empty temp directory, so a file written by a "Fayllar" question cannot leak
 * into the next run or the repo. Exits 1 on any failure.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { backendLessonOutput } from '../prisma/lessonsData/backendOutput';
import { normalizeOutput, validateOutputRecord } from '../src/server/quiz/output';

const PYTHON = process.env.PYTHON ?? 'python3.10';
const TIMEOUT_MS = 5000;

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function run(code: string, hashSeed: string): { stdout: string; stderr: string; status: number | null } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tq-output-'));
  try {
    const result = spawnSync(PYTHON, ['-I', '-c', code], {
      cwd: dir,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      env: { PATH: process.env.PATH ?? '', PYTHONHASHSEED: hashSeed, PYTHONIOENCODING: 'utf-8' },
    });
    if (result.error) throw result.error;
    return { stdout: result.stdout, stderr: result.stderr, status: result.status };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function main(): void {
  const version = spawnSync(PYTHON, ['--version'], { encoding: 'utf8' });
  if (version.error || !`${version.stdout}${version.stderr}`.includes('3.10')) {
    console.error(`Python 3.10 topilmadi (${PYTHON}). PYTHON=... bilan ko'rsating.`);
    process.exit(1);
  }

  const only = argValue('--lesson');
  const records = backendLessonOutput.filter((r) => !only || r.lessonKey === only);
  const failures: string[] = [];

  for (const record of records) {
    const where = `${record.lessonKey} #${record.order}`;
    const problems = validateOutputRecord(record);
    if (problems.length > 0) {
      failures.push(`${where}: ${problems.join(', ')}`);
      continue;
    }
    const { stdout, stderr, status } = run(record.code, '1');
    if (status !== 0 || stderr.trim() !== '') {
      failures.push(`${where}: kod xato bilan tugadi (status ${status})\n${stderr.trim()}`);
      continue;
    }
    // Run again under another hash seed: a snippet whose output changes between
    // runs (order of a set of strings, time, randomness) has no fixed answer key.
    const again = run(record.code, '2').stdout;
    if (normalizeOutput(again) !== normalizeOutput(stdout)) {
      failures.push(`${where}: natija har safar boshqacha — savolga yaramaydi`);
      continue;
    }
    if (normalizeOutput(stdout) !== normalizeOutput(record.expectedOutput)) {
      failures.push(`${where}: kutilgan\n${record.expectedOutput}\n--- haqiqatda\n${stdout}`);
    }
  }

  if (failures.length > 0) {
    console.error(failures.join('\n\n'));
    console.error(`\n${failures.length} / ${records.length} savol tekshiruvdan o'tmadi.`);
    process.exit(1);
  }
  console.log(`${records.length} ta "Kod nima chiqaradi?" savoli Python 3.10 da tekshirildi — hammasi to'g'ri.`);
}

main();

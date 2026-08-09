// Aggregator for the hand-authored backend lesson practice problems.
//
// The problems live in per-block part files (one file per group of lessons) so
// each stays small and reviewable; this module just concatenates them in lesson
// order. Every `expectedStdout` in the parts was captured from a real Piston run
// against a reference solution, so the auto-grader can compare exact output.
//
// Adding a new block: create `backendProblems.m<N><x>.ts`, then import and
// append it below.
import type { LessonProblemRecord } from './types';
import { backendProblemsM1a } from './backendProblems.m1a';
import { backendProblemsM1B } from './backendProblems.m1b';
import { backendProblemsM1c } from './backendProblems.m1c';
import { backendProblemsP01 } from './backendProblems.p01';
import { backendProblemsP02 } from './backendProblems.p02';
import { backendProblemsP03 } from './backendProblems.p03';
import { backendProblemsP04 } from './backendProblems.p04';
import { backendProblemsP05 } from './backendProblems.p05';
import { backendProblemsP06 } from './backendProblems.p06';
import { backendProblemsP07 } from './backendProblems.p07';
import { backendProblemsP08 } from './backendProblems.p08';
import { backendProblemsP09 } from './backendProblems.p09';
import { backendProblemsP10 } from './backendProblems.p10';
import { backendProblemsP11 } from './backendProblems.p11';
import { backendProblemsP12 } from './backendProblems.p12';

export const backendLessonProblems: LessonProblemRecord[] = [
  // Oy 1 — darslar 1..12
  ...backendProblemsM1a,
  ...backendProblemsM1B,
  ...backendProblemsM1c,
  // Darslar 13..96. Ba'zi darslar (Docker, GitHub, portfolio, mini-loyiha va h.k.)
  // stdin/stdout bilan halol tekshirilmaydi — ular ataylab bo'sh qoldirilgan.
  ...backendProblemsP01,
  ...backendProblemsP02,
  ...backendProblemsP03,
  ...backendProblemsP04,
  ...backendProblemsP05,
  ...backendProblemsP06,
  ...backendProblemsP07,
  ...backendProblemsP08,
  ...backendProblemsP09,
  ...backendProblemsP10,
  ...backendProblemsP11,
  ...backendProblemsP12,
];

// `Problem.key` is unique in the schema and the seed upserts on it, so a
// duplicate across part files would silently overwrite an earlier problem
// instead of creating both. Fail loudly at import time instead.
const duplicateKeys = [
  ...new Set(
    backendLessonProblems
      .map((problem) => problem.key)
      .filter((key, index, keys) => keys.indexOf(key) !== index)
  ),
];

if (duplicateKeys.length > 0) {
  throw new Error(
    `backendLessonProblems: duplicate problem key(s): ${duplicateKeys.join(', ')}`
  );
}

// Aggregator for the hand-authored backend lesson quiz (TEKSHIRUV) questions.
//
// The questions live in per-block part files (one file per group of lessons) so
// each stays small and reviewable; this module just concatenates them in lesson
// order. Every question has exactly four Uzbek options and a single correct one.
//
// Adding a new block: create `backendQuiz.m<N><x>.ts`, then import and append it
// below.
import type { LessonQuizRecord } from './types';
import { backendQuizM1a } from './backendQuiz.m1a';
import { backendQuizM1b } from './backendQuiz.m1b';
import { backendQuizB01 } from './backendQuiz.b01';
import { backendQuizB02 } from './backendQuiz.b02';
import { backendQuizB03 } from './backendQuiz.b03';
import { backendQuizB04 } from './backendQuiz.b04';
import { backendQuizB05 } from './backendQuiz.b05';
import { backendQuizB06 } from './backendQuiz.b06';
import { backendQuizB07 } from './backendQuiz.b07';
import { backendQuizB08 } from './backendQuiz.b08';
import { backendQuizB09 } from './backendQuiz.b09';
import { backendQuizB10 } from './backendQuiz.b10';
import { backendQuizB11 } from './backendQuiz.b11';
import { backendQuizB12 } from './backendQuiz.b12';

export const backendLessonQuiz: LessonQuizRecord[] = [
  // Oy 1 — darslar 1..12
  ...backendQuizM1a,
  ...backendQuizM1b,
  // Darslar 13..96, har bir fayl 7 ta darsni qamrab oladi
  ...backendQuizB01,
  ...backendQuizB02,
  ...backendQuizB03,
  ...backendQuizB04,
  ...backendQuizB05,
  ...backendQuizB06,
  ...backendQuizB07,
  ...backendQuizB08,
  ...backendQuizB09,
  ...backendQuizB10,
  ...backendQuizB11,
  ...backendQuizB12,
];

// `QuizQuestion` is unique on `(lessonId, order)` and the seed upserts on it, so
// a duplicate `(lessonKey, order)` pair across part files would silently
// overwrite an earlier question instead of creating both — the student would
// simply never see it. Fail loudly at import time instead.
const duplicatePairs = [
  ...new Set(
    backendLessonQuiz
      .map((question) => `${question.lessonKey}#${question.order}`)
      .filter((pair, index, pairs) => pairs.indexOf(pair) !== index)
  ),
];

if (duplicatePairs.length > 0) {
  throw new Error(
    `backendLessonQuiz: duplicate (lessonKey, order) pair(s): ${duplicatePairs.join(', ')}`
  );
}

// Aggregator for the "Kod nima chiqaradi?" (output-prediction) questions.
//
// Part files hold one block of lessons each. Every answer key is proven on
// Python 3.10 before commit:  npx tsx scripts/verifyOutputQuestions.ts
//
// Adding a block: create `backendOutput.o<N>.ts`, then import and append it below.
import type { LessonOutputRecord } from './types';
import { backendOutputO1 } from './backendOutput.o1';
import { backendOutputO2 } from './backendOutput.o2';
import { backendOutputO3 } from './backendOutput.o3';

export const backendLessonOutput: LessonOutputRecord[] = [
  // Darslar 1..12 — Python asoslari
  ...backendOutputO1,
  // Darslar 13..24 — Python chuqurroq (21: pip — kodsiz, o'tkazib yuborilgan)
  ...backendOutputO2,
  // Darslar 25..33 — OOP va Ilg'or Python
  ...backendOutputO3,
];

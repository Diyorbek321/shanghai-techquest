import { z } from 'zod';

/** One row of a project rubric: what is judged and how much it is worth. */
export interface RubricCriterion {
  label: string;
  maxPoints: number;
  hint: string;
}

/** A teacher's mark against one criterion. */
export interface RubricScore {
  label: string;
  points: number;
  note: string;
}

/**
 * Fallback rubric for any `kind = 'project'` lesson that has no ProjectRubric row
 * of its own. Employers look at the same four things, so the weights mirror that:
 * a project that runs but is undocumented and undefendable still fails.
 * maxPoints deliberately sums to 100.
 */
export const DEFAULT_PROJECT_RUBRIC: readonly RubricCriterion[] = Object.freeze([
  Object.freeze({
    label: 'Funksionallik',
    maxPoints: 40,
    hint: "Loyiha talab qilingan barcha vazifalarni xatosiz bajaradimi?",
  }),
  Object.freeze({
    label: 'Kod sifati',
    maxPoints: 25,
    hint: "Kod o'qilishi oson, takrorlanmagan va mantiqiy qismlarga ajratilganmi?",
  }),
  Object.freeze({
    label: 'Hujjatlashtirish',
    maxPoints: 15,
    hint: "README loyihani ishga tushirish va ishlatish uchun yetarlimi?",
  }),
  Object.freeze({
    label: 'Himoya matni',
    maxPoints: 20,
    hint: "Talaba o'z qarorlarini va texnologiya tanlovini tushuntira oladimi?",
  }),
]);

/** Every rubric total is out of this, whatever criteria list is in play. */
export const RUBRIC_MAX_POINTS = 100;

const criterionSchema = z.object({
  label: z.string().min(1),
  maxPoints: z.number().finite().min(0).max(RUBRIC_MAX_POINTS),
  hint: z.string().default(''),
});

const scoreSchema = z.object({
  label: z.string().min(1),
  points: z.number().finite(),
  note: z.string().default(''),
});

const criteriaListSchema = z.array(criterionSchema);
const scoreListSchema = z.array(scoreSchema);

/**
 * Reads the untyped `ProjectRubric.criteria` Json column. The column defaults to
 * `[]` and can hold hand-edited content, so malformed data degrades to the
 * default rubric rather than throwing — a broken rubric row must not 500 a
 * portfolio page. Never throws.
 */
export function parseRubricCriteria(raw: unknown): RubricCriterion[] {
  const parsed = criteriaListSchema.safeParse(raw);
  if (!parsed.success || parsed.data.length === 0) {
    return DEFAULT_PROJECT_RUBRIC.map((criterion) => ({ ...criterion }));
  }
  return parsed.data.map((criterion) => ({ ...criterion }));
}

/**
 * Reads the untyped `Submission.rubricScores` Json column. Ungraded submissions
 * hold `[]`, and legacy/malformed content must read as "not graded yet" instead
 * of throwing. Never throws.
 */
export function parseRubricScores(raw: unknown): RubricScore[] {
  const parsed = scoreListSchema.safeParse(raw);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.map((score) => ({ ...score }));
}

/**
 * Totals a set of marks against a criteria list. Unknown labels are ignored,
 * each mark is clamped to its criterion's `maxPoints` (and to 0 below), and a
 * repeated label counts once — so a hand-edited Json column can never inflate a
 * student's portfolio score past the rubric maximum.
 */
export function scoreFromRubric(
  scores: readonly RubricScore[],
  criteria: readonly RubricCriterion[] = DEFAULT_PROJECT_RUBRIC,
): number {
  const maxByLabel = new Map(criteria.map((criterion) => [criterion.label, criterion.maxPoints]));
  const counted = new Set<string>();

  return scores.reduce((total, score) => {
    const max = maxByLabel.get(score.label);
    if (max === undefined || counted.has(score.label)) {
      return total;
    }
    counted.add(score.label);
    return total + Math.min(Math.max(score.points, 0), max);
  }, 0);
}

/** Highest total the given criteria list can produce, clamped to the rubric max. */
export function rubricMaxPoints(criteria: readonly RubricCriterion[] = DEFAULT_PROJECT_RUBRIC): number {
  const sum = criteria.reduce((total, criterion) => total + criterion.maxPoints, 0);
  return sum > 0 ? sum : RUBRIC_MAX_POINTS;
}

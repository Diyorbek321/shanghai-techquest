/**
 * The weekly summary a parent reads.
 *
 * Evidence shapes the WORDING here, not just the contents. A second-order
 * meta-analysis over 23 meta-analyses and 1 177 primary studies finds parental
 * involvement helps, but modestly (ES ≈ 0.16–0.18) — and the effect is carried
 * by parental EXPECTATIONS and by talking with the child about school, while
 * CONTROLLING involvement is associated with a NEGATIVE effect. Intrusive
 * homework involvement specifically shows a negative link.
 *
 * So this report is built to start a conversation, not to hand a parent a
 * charge sheet. It never counts what was missed, never ranks the child against
 * classmates, and ends with questions to ask rather than instructions to
 * enforce. A report that reads "your child did not do 3 tasks" produces exactly
 * the supervision the evidence says backfires.
 *
 * Pure functions: no Prisma, no clock.
 */

export interface WeekCounts {
  lessonsCompleted: number;
  problemsSolved: number;
  quizAnswered: number;
  quizCorrect: number;
  dailyExercises: number;
  streak: number;
  /** Tag the student solved the most problems in this week, if any. */
  strongestTopic: string | null;
}

export interface ParentReport {
  headline: string;
  highlights: string[];
  /** Openers a parent can use at the dinner table. */
  conversationStarters: string[];
}

function quizLine(counts: WeekCounts): string | null {
  if (counts.quizAnswered === 0) return null;
  const pct = Math.round((counts.quizCorrect / counts.quizAnswered) * 100);
  return `Takrorlash savollari: ${counts.quizAnswered} ta javob, ${pct}% to'g'ri.`;
}

export function buildParentReport(name: string, counts: WeekCounts): ParentReport {
  const nothingYet =
    counts.lessonsCompleted === 0 &&
    counts.problemsSolved === 0 &&
    counts.quizAnswered === 0 &&
    counts.dailyExercises === 0;

  // Even an empty week is reported as an invitation. "Did nothing" is a verdict
  // a parent will act on by tightening control, which is the documented harm.
  const headline = nothingYet
    ? `${name} bu hafta platformada faol bo'lmadi.`
    : `${name} bu hafta ${[
        counts.lessonsCompleted > 0 ? `${counts.lessonsCompleted} ta darsni yakunladi` : null,
        counts.problemsSolved > 0 ? `${counts.problemsSolved} ta masala yechdi` : null,
      ]
        .filter(Boolean)
        .join(', ')}.`.replace(' bu hafta .', ' bu hafta ishladi.');

  const highlights = [
    counts.strongestTopic ? `Eng ko'p ishlagan mavzusi: ${counts.strongestTopic}.` : null,
    quizLine(counts),
    counts.dailyExercises > 0 ? `Kunlik mashq: ${counts.dailyExercises} kun.` : null,
    counts.streak > 0 ? `Ketma-ket faol kunlar: ${counts.streak}.` : null,
  ].filter((line): line is string => line !== null);

  const conversationStarters = nothingYet
    ? [
        'Bu hafta darsda nima qiyin tuyuldi?',
        "Qaysi mavzuni birga ko'rib chiqsak foydali bo'lardi?",
      ]
    : [
        counts.strongestTopic
          ? `${counts.strongestTopic} mavzusida nima o'rganding? Menga tushuntirib bera olasanmi?`
          : "Bu hafta o'rganganingdan qaysi biri eng qiziq bo'ldi?",
        "Qaysi masala eng qiyin bo'ldi va uni qanday yechding?",
        "Keyingi hafta nimani o'rganmoqchisan?",
      ];

  return { headline, highlights, conversationStarters };
}

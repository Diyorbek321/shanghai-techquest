import { Prisma, PrismaClient } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Turns "you were paid for that" into "here is what you can now do".
 *
 * Meta-analytic work on rewards (Deci, Koestner & Ryan) finds that tangible
 * rewards undermine intrinsic motivation specifically when they read as
 * CONTROLLING — payment for compliance — and that the same reward is harmless
 * or helpful when it reads as INFORMATIONAL, i.e. as evidence of growing
 * competence. The XP here is unchanged; only what the student is told changes,
 * because the framing is the part the evidence says matters.
 *
 * The topic line is drawn from real counts rather than praise adjectives: a
 * student who is told "great job!" after every submission learns the phrase
 * carries no information, while "Rekursiya: 4/12" is checkable and moves.
 */

/** Longest tag first: "list comprehension" says more than "python". */
function primaryTag(tags: readonly string[]): string | null {
  const usable = tags.map((t) => t.trim()).filter(Boolean);
  if (usable.length === 0) return null;
  return [...usable].sort((a, b) => b.length - a.length)[0];
}

export interface CompetenceContext {
  /** The tag the progress line is about, or null when the problem has no tags. */
  topic: string | null;
  /** Distinct problems with this tag the student has now solved. */
  solved: number;
  /** Problems carrying this tag that exist at all. */
  available: number;
}

export async function competenceContext(
  db: Db,
  userId: string,
  tags: readonly string[]
): Promise<CompetenceContext> {
  const topic = primaryTag(tags);
  if (!topic) return { topic: null, solved: 0, available: 0 };

  const [solvedRows, available] = await Promise.all([
    db.problemSubmission.findMany({
      where: { userId, passed: true, problem: { tags: { has: topic } } },
      select: { problemId: true },
      distinct: ['problemId'],
    }),
    db.problem.count({ where: { tags: { has: topic } } }),
  ]);

  return { topic, solved: solvedRows.length, available };
}

/**
 * The sentence a student reads after solving. The reward is stated last and
 * without exclamation — present, but not the headline.
 */
export function competenceMessage(
  problemTitle: string,
  pointsAwarded: number,
  context: CompetenceContext
): string {
  const parts = [`"${problemTitle}" — barcha testlar o'tdi.`];

  if (context.topic && context.available > 0) {
    parts.push(`${context.topic}: ${context.solved}/${context.available} masala yechildi.`);
    if (context.solved === context.available) {
      parts.push(`Bu mavzuni to'liq yopdingiz.`);
    }
  }

  if (pointsAwarded > 0) parts.push(`+${pointsAwarded} XP.`);
  return parts.join(' ');
}

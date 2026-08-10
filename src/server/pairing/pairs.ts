/**
 * Suggested pairs for pair programming.
 *
 * Evidence: pair programming raises pass rates and retention in introductory
 * programming (and confidence and enjoyment with it), while barely moving exam
 * marks — which is the right trade here, because the problem on a 96-lesson
 * course is students leaving, not students scoring badly. The systematic review
 * that covers 74 studies identifies SKILL-LEVEL COMPATIBILITY as the single
 * factor that most affects whether pairing works.
 *
 * So pairs are formed between adjacent students in a skill ordering rather than
 * strongest-with-weakest. A large gap turns the session into one student typing
 * and the other watching, which is the failure mode pairing is supposed to
 * avoid.
 *
 * Pure functions: no Prisma, no clock, no randomness.
 */

export interface Pairable {
  id: string;
  name: string;
  /** Any monotonic measure of current skill; the caller decides what it is. */
  score: number;
}

export interface SuggestedPair {
  a: Pairable;
  b: Pairable;
  /** Absolute skill gap — the smaller, the more balanced the session. */
  gap: number;
}

export interface PairingPlan {
  pairs: SuggestedPair[];
  /** Left over when the class has an odd number of students. */
  unpaired: Pairable | null;
}

/**
 * Adjacent pairing over the skill ordering.
 *
 * With an odd class the LAST student is left over rather than the first: the
 * leftover is whoever has the highest score, because a strong student working
 * alone for one session is a smaller loss than a struggling student left
 * without a partner — which is precisely the student pairing is meant to hold
 * on to.
 */
export function suggestPairs(students: readonly Pairable[]): PairingPlan {
  // Ascending by score, id as tiebreak so the plan is stable across calls and
  // a teacher does not see the roster reshuffle on every refresh.
  const ordered = [...students].sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));

  const pairs: SuggestedPair[] = [];
  let i = 0;
  for (; i + 1 < ordered.length; i += 2) {
    const a = ordered[i];
    const b = ordered[i + 1];
    pairs.push({ a, b, gap: Math.abs(a.score - b.score) });
  }

  return { pairs, unpaired: i < ordered.length ? ordered[i] : null };
}

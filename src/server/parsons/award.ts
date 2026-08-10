/**
 * What a solved Parsons problem is worth.
 *
 * Deliberately a fraction of the full problem: ordering given lines is a real
 * step, but it is scaffolding, not the same achievement as writing the code.
 * Paying the same for both would push students to take the easier route on
 * every problem and quietly remove the writing practice the course exists for.
 *
 * Nothing is paid twice: a student who already solved the problem by writing it
 * gets no Parsons award, and a Parsons problem pays only on the first solve.
 */
export const PARSONS_AWARD_RATIO = 0.4;

export function parsonsPoints(problemPoints: number): number {
  return Math.max(1, Math.round(problemPoints * PARSONS_AWARD_RATIO));
}

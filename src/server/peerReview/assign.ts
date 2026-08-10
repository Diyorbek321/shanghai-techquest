/**
 * Who reviews whose work.
 *
 * Evidence: a systematic review of 51 empirical studies finds peer code review
 * improves programming skill, adherence to coding standards, time management,
 * and the ability to give and take criticism, with student satisfaction above
 * 80%. It also names the recurring failure: LOW STUDENT ENGAGEMENT. So reviews
 * are assigned rather than volunteered, and every submitter gets the same
 * number of reviews to do and to receive.
 *
 * Pure functions: no Prisma, no clock, no randomness. The rotation is derived
 * from the submitter order, which makes the assignment reproducible — a student
 * who reloads must not be handed a different classmate's work each time.
 */

export interface Submitter {
  submissionId: string;
  userId: string;
  /** Pair-programming partner, if any. */
  partnerId: string | null;
}

export interface ReviewAssignment {
  reviewerId: string;
  submissionId: string;
  authorId: string;
}

/**
 * Ring rotation: the student at position i reviews the submissions at i+1,
 * i+2, … i+k. It guarantees nobody reviews themselves, everyone reviews the
 * same number of pieces, and everyone receives the same number — properties a
 * random draw only gets on average, which is not good enough when the student
 * who receives nothing notices.
 *
 * A pair's two submissions are the same work, so reviewing your partner is
 * reviewing yourself; those pairings are skipped and the rotation moves on to
 * the next classmate.
 */
export function assignReviews(submitters: readonly Submitter[], perStudent: number): ReviewAssignment[] {
  const ordered = [...submitters].sort((a, b) => a.userId.localeCompare(b.userId));
  const n = ordered.length;
  // With one submitter there is nobody to review; with two who are partners,
  // likewise. Returning nothing is correct — inventing a self-review is not.
  if (n < 2 || perStudent < 1) return [];

  const assignments: ReviewAssignment[] = [];

  for (let i = 0; i < n; i += 1) {
    const reviewer = ordered[i];
    let given = 0;
    // Walk the ring once. `offset < n` bounds the search: when everyone else is
    // this student's partner there is simply nothing to assign.
    for (let offset = 1; offset < n && given < perStudent; offset += 1) {
      const target = ordered[(i + offset) % n];
      if (target.userId === reviewer.userId) continue;
      if (reviewer.partnerId && target.userId === reviewer.partnerId) continue;
      if (target.partnerId && target.partnerId === reviewer.userId) continue;

      assignments.push({
        reviewerId: reviewer.userId,
        submissionId: target.submissionId,
        authorId: target.userId,
      });
      given += 1;
    }
  }

  return assignments;
}

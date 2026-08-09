import { ClassGoal, ClassGoalMetric } from '@prisma/client';
import { prisma } from '../db';

/** The parts of a goal needed to count it; a full ClassGoal satisfies this. */
type CountableGoal = Pick<ClassGoal, 'classId' | 'metric' | 'target' | 'startsAt' | 'endsAt'>;

/**
 * How many events the cohort has contributed toward the goal.
 *
 * Counted live from the source tables rather than kept in a column: a stored
 * tally drifts the moment anything is deleted or backdated, and a class goal
 * that shows the wrong number is worse than no goal at all.
 */
export async function goalProgress(goal: CountableGoal): Promise<number> {
  const window = { gte: goal.startsAt, lt: goal.endsAt };
  const memberFilter = { enrollments: { some: { classId: goal.classId } } };

  switch (goal.metric) {
    case ClassGoalMetric.PROBLEMS_SOLVED:
      return prisma.problemSubmission.count({
        where: { passed: true, submittedAt: window, user: memberFilter },
      });

    case ClassGoalMetric.DAILY_EXERCISES:
      return prisma.dailyExerciseLog.count({
        where: { completed: true, completedAt: window, user: memberFilter },
      });

    case ClassGoalMetric.HOMEWORK_DONE:
      // Homework rows already carry classId, so membership needs no join; the
      // window applies to the deadline because Homework records no completion
      // timestamp of its own.
      return prisma.homework.count({
        where: { classId: goal.classId, completed: true, dueDate: window },
      });

    default:
      return 0;
  }
}

export interface GoalSummary {
  current: number;
  target: number;
  percent: number;
  reached: boolean;
  xpReward: number;
  /** True once the reward has actually been paid out. */
  rewarded: boolean;
}

export function summarise(
  goal: Pick<ClassGoal, 'target' | 'xpReward' | 'achievedAt'>,
  current: number
): GoalSummary {
  // A zero target is degenerate but must not divide by zero; treat it as met.
  const percent = goal.target <= 0 ? 100 : Math.min(100, Math.round((current / goal.target) * 100));
  return {
    current,
    target: goal.target,
    percent,
    reached: goal.target <= 0 || current >= goal.target,
    xpReward: goal.xpReward,
    rewarded: goal.achievedAt !== null,
  };
}

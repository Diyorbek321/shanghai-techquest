/**
 * Hands every student their daily plan without waiting for them to open the
 * site, then nudges them: a morning notice that the day's work is ready and
 * an evening reminder if it is still not done.
 *
 * Before this, a plan was only created when the student opened the
 * dashboard, so a student who stayed away was never given any work and the
 * teacher's board could not tell "skipped it" from "never saw it".
 *
 * Runs in-process on a timer. Every step is idempotent — the plan's
 * (userId, date) key and the `notifiedAt` / `remindedAt` claims — so a tick
 * that overlaps a restart, or a second instance, never doubles anything.
 */
import { Role } from '@prisma/client';
import { prisma } from '../db';
import { isLessonDay } from '../lessons/schedule';
import { notify } from '../notifications/notify';
import { calendarDate, todayKey } from '../utils/dayKey';
import { eveningNotice, morningNotice, noticePhase, shouldRemind, type Notice, type NoticePhase } from './dispatch';
import { DAILY_PLAN_XP, evaluate, findCohort, getOrCreateTodaysPlan, settle } from './service';

export const TICK_MS = 10 * 60_000;

/** Limits a run to some students; the timer passes none and covers everyone. */
export interface Scope {
  readonly userIds?: readonly string[];
}

const scopeFilter = (scope: Scope) => (scope.userIds ? { userId: { in: [...scope.userIds] } } : {});

/** Students on a track who are in at least one class with a timetable. */
async function eligibleStudents(scope: Scope) {
  return prisma.user.findMany({
    where: {
      ...(scope.userIds ? { id: { in: [...scope.userIds] } } : {}),
      role: Role.STUDENT,
      track: { not: null },
      enrollments: { some: { class: { startDate: { not: null } } } },
    },
    select: { id: true, track: true },
  });
}

/** Creates today's plan for everyone who does not have one yet. Returns how many were made. */
export async function issueTodaysPlans(scope: Scope = {}): Promise<number> {
  const today = todayKey();
  const students = await eligibleStudents(scope);
  const existing = await prisma.dailyPlan.findMany({
    where: { date: today, userId: { in: students.map((s) => s.id) } },
    select: { userId: true },
  });
  const hasPlan = new Set(existing.map((row) => row.userId));

  let created = 0;
  for (const student of students) {
    if (hasPlan.has(student.id) || !student.track) continue;
    try {
      // findCohort also checks the class is on the student's own track.
      const cohort = await findCohort(student.id, student.track);
      if (!cohort) continue;
      await getOrCreateTodaysPlan(student.id, student.track, cohort);
      created++;
    } catch (err) {
      // One student's bad data must not stop the rest of the school's plans.
      console.error(`Daily plan issue failed for ${student.id}:`, err);
    }
  }
  return created;
}

/**
 * Sends one notice per unfinished, non-empty plan of today. The claim column
 * is set before the message is written: a lost notice is better than the
 * same reminder twice. Evening claims both columns so no late "ready" notice
 * follows a reminder.
 */
export async function sendNotices(phase: Exclude<NoticePhase, 'none'>, scope: Scope = {}): Promise<number> {
  const today = todayKey();
  const claimColumn = phase === 'morning' ? 'notifiedAt' : 'remindedAt';
  const plans = await prisma.dailyPlan.findMany({
    where: { ...scopeFilter(scope), date: today, completedAt: null, [claimColumn]: null, user: { pushEnabled: true } },
    include: { user: { select: { streak: true, track: true } } },
  });

  let sent = 0;
  for (const plan of plans) {
    try {
      const evaluation = await evaluate(plan.userId, plan);
      // Done but not yet settled (e.g. finished on another path): close it, say nothing.
      if (evaluation.done) {
        await settle(plan, evaluation);
        continue;
      }
      if (evaluation.items.length === 0) continue;
      if (phase === 'evening' && !shouldRemind(plan)) continue;

      const now = new Date();
      const claimed = await prisma.dailyPlan.updateMany({
        where: { id: plan.id, [claimColumn]: null },
        data: phase === 'morning' ? { notifiedAt: now } : { remindedAt: now, notifiedAt: plan.notifiedAt ?? now },
      });
      if (claimed.count === 0) continue;

      let notice: Notice;
      if (phase === 'morning') {
        const cohort = plan.user.track ? await findCohort(plan.userId, plan.user.track) : null;
        const lessonDay = cohort ? isLessonDay(cohort.startDate, cohort.lessonDays, calendarDate(today)) : false;
        notice = morningNotice(evaluation.items, lessonDay, DAILY_PLAN_XP);
      } else {
        notice = eveningNotice(evaluation.items, plan.user.streak);
      }
      await notify(prisma, { userId: plan.userId, type: phase === 'morning' ? 'INFO' : 'WARNING', ...notice });
      sent++;
    } catch (err) {
      console.error(`Daily plan ${phase} notice failed for ${plan.userId}:`, err);
    }
  }
  return sent;
}

export async function runTick(now: Date = new Date()): Promise<void> {
  await issueTodaysPlans();
  const phase = noticePhase(now);
  if (phase !== 'none') await sendNotices(phase);
}

let running = false;

/** Starts the timer. Call once from server startup, never from createApp (tests build apps). */
export function startDailyPlanScheduler(): void {
  if (process.env.DAILY_PLAN_SCHEDULER === 'off') return;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await runTick();
    } catch (err) {
      console.error('Daily plan scheduler tick failed:', err);
    } finally {
      running = false;
    }
  };
  void tick();
  setInterval(tick, TICK_MS).unref();
}

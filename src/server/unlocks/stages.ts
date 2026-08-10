/**
 * Game mechanics open over the course rather than all at once.
 *
 * Evidence: gamification's measured effect decays with time on task. One
 * meta-analysis puts interventions of a few days at ES 1.57, 2-16 weeks at
 * 0.39, and 1-2 years at −0.20 — i.e. sustained gamification eventually stops
 * helping and starts hurting. The authors name this a novelty effect. A
 * 96-lesson course taught three times a week runs about eight months, squarely
 * inside the range where the decay shows up.
 *
 * Handing a first-week student fifteen mechanics spends all of the novelty in
 * week one and leaves seven months with nothing new. Staging them keeps
 * something arriving, and has a second effect worth as much: a student on
 * lesson 2 sees a small, legible product instead of a control panel.
 *
 * Pure functions: no Prisma, no clock.
 */

export interface Stage {
  /** Matches ViewType on the client. */
  feature: string;
  label: string;
  /** Lessons that must be completed before it opens. */
  requiredLessons: number;
  /** Shown on the locked entry, so the lock reads as a goal rather than a wall. */
  teaser: string;
}

/**
 * Ordered by when they open. The first block is everything a student needs to
 * actually learn — those are never locked, because gating the course itself
 * behind progress in the course is circular.
 */
export const STAGES: Stage[] = [
  { feature: 'leaderboard', label: 'Reyting', requiredLessons: 5, teaser: 'Ligangizdagi tengdoshlaringiz bilan solishtiring.' },
  { feature: 'shop', label: "Do'kon", requiredLessons: 8, teaser: 'Yiqqan tangalaringizni sarflang.' },
  { feature: 'teams', label: 'Jamoalar', requiredLessons: 14, teaser: "Sinfdoshlar bilan jamoa tuzing." },
  { feature: 'arena', label: 'Arena', requiredLessons: 20, teaser: 'Teng kuchli raqib bilan kod jangi.' },
  { feature: 'myworld', label: 'Mening dunyom', requiredLessons: 28, teaser: "O'z shahringizni quring." },
];

/** Features outside the staging system — the course and its practice. */
export const ALWAYS_OPEN = [
  'dashboard',
  'backend_course',
  'frontend_course',
  'office_course',
  'robotics_lab',
  'problems',
  'codelab',
  'assignments',
  'homework',
  'grades',
  'calendar',
  'notifications',
  'certificates',
  'profile',
  'settings',
  'help',
  'achievements',
  'classes',
  'attendance',
];

export interface UnlockState {
  unlocked: string[];
  locked: { feature: string; label: string; requiredLessons: number; teaser: string; remaining: number }[];
  /** The next thing to open, for a single line on the dashboard. */
  next: { label: string; remaining: number } | null;
}

/**
 * `lessonsCompleted` is the same count the certificate page uses, so a student
 * never sees two different numbers describing their own progress.
 *
 * Staff pass `staff: true`: a teacher needs every screen from day one, and
 * their own lesson count is zero by definition.
 */
export function unlockState(lessonsCompleted: number, staff = false): UnlockState {
  if (staff) {
    return { unlocked: [...ALWAYS_OPEN, ...STAGES.map((s) => s.feature)], locked: [], next: null };
  }

  const unlocked = [...ALWAYS_OPEN];
  const locked: UnlockState['locked'] = [];

  for (const stage of STAGES) {
    if (lessonsCompleted >= stage.requiredLessons) {
      unlocked.push(stage.feature);
    } else {
      locked.push({ ...stage, remaining: stage.requiredLessons - lessonsCompleted });
    }
  }

  const nextStage = locked[0];
  return {
    unlocked,
    locked,
    next: nextStage ? { label: nextStage.label, remaining: nextStage.remaining } : null,
  };
}

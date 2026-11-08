import { describe, expect, it } from 'vitest';
import { buildDailyPlan, evaluatePlan, parsePlanItems, type PlanItem } from './planner';

const problems = (...orders: number[]) => orders.map((order, i) => ({ id: `p${order}-${i}`, lessonOrder: order }));

const base = {
  lessonDay: false,
  taughtOrder: 6,
  lessonsPerWeek: 3,
  unsolvedProblems: [],
  dueQuestionIds: [],
  freshQuestions: [],
};

describe('buildDailyPlan', () => {
  describe('level', () => {
    const mixed = [
      { id: 'hard4', lessonOrder: 4, difficulty: 'HARD' },
      { id: 'easy5', lessonOrder: 5, difficulty: 'EASY' },
      { id: 'med6', lessonOrder: 6, difficulty: 'MEDIUM' },
      { id: 'easy1', lessonOrder: 1, difficulty: 'EASY' },
    ];
    const ids = (plan: PlanItem[]) => plan.map((item) => item.kind === 'problem' && item.problemId);

    it('keeps lesson order for a normal student', () => {
      expect(ids(buildDailyPlan({ ...base, unsolvedProblems: mixed, level: 'normal' }))).toEqual(['hard4', 'easy5']);
    });

    it('leads a struggling student with the easiest of this week', () => {
      expect(ids(buildDailyPlan({ ...base, unsolvedProblems: mixed, level: 'struggling' }))).toEqual(['easy5', 'med6']);
    });

    it('leads a strong student with the hardest of this week', () => {
      expect(ids(buildDailyPlan({ ...base, unsolvedProblems: mixed, level: 'strong' }))).toEqual(['hard4', 'med6']);
    });

    it('never pulls an older easy problem ahead of this week', () => {
      const plan = buildDailyPlan({ ...base, unsolvedProblems: mixed, level: 'struggling' });
      expect(ids(plan)).not.toContain('easy1');
    });
  });

  it('gives a free day two problems from the latest week, oldest of that week first', () => {
    const plan = buildDailyPlan({ ...base, unsolvedProblems: problems(6, 2, 4, 5, 4) });
    expect(plan).toEqual([
      { kind: 'problem', problemId: 'p4-2' },
      { kind: 'problem', problemId: 'p4-4' },
    ]);
  });

  it('falls back to older unsolved lessons, most recent first, once the week is done', () => {
    const plan = buildDailyPlan({ ...base, unsolvedProblems: problems(1, 3, 2) });
    expect(plan.map((item) => item.kind === 'problem' && item.problemId)).toEqual(['p3-1', 'p2-2']);
  });

  it('never hands out a problem from a lesson that has not been taught yet', () => {
    const plan = buildDailyPlan({ ...base, taughtOrder: 3, unsolvedProblems: problems(4, 5) });
    expect(plan).toEqual([]);
  });

  it('puts due reviews before fresh questions and caps the quiz at five', () => {
    const plan = buildDailyPlan({
      ...base,
      dueQuestionIds: ['d1', 'd2'],
      freshQuestions: [
        { id: 'f2', lessonOrder: 2 },
        { id: 'f6', lessonOrder: 6 },
        { id: 'f5', lessonOrder: 5 },
        { id: 'f5b', lessonOrder: 5 },
        { id: 'f9', lessonOrder: 9 },
      ],
    });
    expect(plan).toEqual([{ kind: 'quiz', questionIds: ['d1', 'd2', 'f6', 'f5', 'f5b'] }]);
  });

  it('keeps a lesson day light but still writes code: one problem and the quiz', () => {
    const plan = buildDailyPlan({
      ...base,
      lessonDay: true,
      unsolvedProblems: problems(5, 6),
      dueQuestionIds: ['d1'],
    });
    expect(plan).toEqual([
      { kind: 'problem', problemId: 'p5-0' },
      { kind: 'quiz', questionIds: ['d1'] },
    ]);
  });

  it('gives a lesson day one problem when there is nothing to quiz on', () => {
    const plan = buildDailyPlan({ ...base, lessonDay: true, unsolvedProblems: problems(5, 6) });
    expect(plan).toEqual([{ kind: 'problem', problemId: 'p5-0' }]);
  });

  it('is empty before anything has been taught', () => {
    expect(buildDailyPlan({ ...base, taughtOrder: 0, unsolvedProblems: problems(1) })).toEqual([]);
  });
});

describe('evaluatePlan', () => {
  const dayStart = new Date('2026-09-14T00:00:00.000Z');
  const items: PlanItem[] = [
    { kind: 'problem', problemId: 'p1' },
    { kind: 'quiz', questionIds: ['q1', 'q2'] },
  ];

  it('is done only when every problem passed and every question is right today', () => {
    const result = evaluatePlan(items, {
      passedProblemIds: new Set(['p1']),
      attempts: new Map([
        ['q1', { correct: true, answeredAt: new Date('2026-09-14T09:00:00.000Z') }],
        ['q2', { correct: true, answeredAt: new Date('2026-09-14T09:01:00.000Z') }],
      ]),
      dayStart,
    });
    expect(result.done).toBe(true);
    expect(result.items.map((item) => item.done)).toEqual([true, true]);
  });

  it('does not count a quiz answered before the plan day or answered wrong', () => {
    const result = evaluatePlan(items, {
      passedProblemIds: new Set(['p1']),
      attempts: new Map([
        ['q1', { correct: true, answeredAt: new Date('2026-09-13T22:00:00.000Z') }],
        ['q2', { correct: false, answeredAt: new Date('2026-09-14T09:00:00.000Z') }],
      ]),
      dayStart,
    });
    expect(result.done).toBe(false);
    expect(result.items[1]).toMatchObject({ done: false, answeredCorrectly: 0, total: 2 });
  });

  it('never marks an empty plan as done', () => {
    expect(evaluatePlan([], { passedProblemIds: new Set(), attempts: new Map(), dayStart }).done).toBe(false);
  });
});

describe('parsePlanItems', () => {
  it('drops malformed rows instead of trusting the stored JSON', () => {
    expect(
      parsePlanItems([
        { kind: 'problem', problemId: 'p1' },
        { kind: 'quiz', questionIds: ['q1', 7] },
        { kind: 'quiz', questionIds: [] },
        { kind: 'video' },
        null,
      ])
    ).toEqual([{ kind: 'problem', problemId: 'p1' }]);
  });
});

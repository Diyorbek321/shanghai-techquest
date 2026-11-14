import { describe, expect, it } from 'vitest';
import { scoreSet } from './score';

const DUE = new Date('2026-11-13T18:59:59.999Z');
const BEFORE = new Date('2026-11-12T10:00:00Z');
const AFTER = new Date('2026-11-14T10:00:00Z');

describe('scoreSet', () => {
  it('is an empty, not-started set when nothing was done', () => {
    expect(scoreSet({ questionIds: ['q1', 'q2'], problemIds: ['p1'], answers: new Map(), passed: new Map(), dueAt: DUE })).toEqual({
      total: 3,
      done: 0,
      correct: 0,
      late: 0,
      percent: 0,
      status: 'not_started',
    });
  });

  it("scores a question by its FIRST answer — retrying until right does not raise the grade", () => {
    const result = scoreSet({
      questionIds: ['q1', 'q2'],
      problemIds: [],
      answers: new Map([
        ['q1', { correct: true, answeredAt: BEFORE }],
        ['q2', { correct: false, answeredAt: BEFORE }],
      ]),
      passed: new Map(),
      dueAt: DUE,
    });
    expect(result).toMatchObject({ total: 2, done: 2, correct: 1, percent: 50, status: 'done' });
  });

  it('counts a problem once its tests pass', () => {
    const result = scoreSet({
      questionIds: [],
      problemIds: ['p1', 'p2'],
      answers: new Map(),
      passed: new Map([['p1', BEFORE]]),
      dueAt: DUE,
    });
    expect(result).toMatchObject({ total: 2, done: 1, correct: 1, percent: 50, status: 'partial' });
  });

  it('marks late work as done but leaves it out of the grade', () => {
    const result = scoreSet({
      questionIds: ['q1'],
      problemIds: ['p1'],
      answers: new Map([['q1', { correct: true, answeredAt: AFTER }]]),
      passed: new Map([['p1', AFTER]]),
      dueAt: DUE,
    });
    expect(result).toMatchObject({ total: 2, done: 2, correct: 0, late: 2, percent: 0, status: 'done' });
  });

  it('ignores answers to questions outside the set', () => {
    const result = scoreSet({
      questionIds: ['q1'],
      problemIds: [],
      answers: new Map([['other', { correct: true, answeredAt: BEFORE }]]),
      passed: new Map([['p-other', BEFORE]]),
      dueAt: DUE,
    });
    expect(result).toMatchObject({ total: 1, done: 0, correct: 0 });
  });

  it('rounds the percent', () => {
    const answers = new Map([
      ['q1', { correct: true, answeredAt: BEFORE }],
      ['q2', { correct: true, answeredAt: BEFORE }],
      ['q3', { correct: false, answeredAt: BEFORE }],
    ]);
    expect(scoreSet({ questionIds: ['q1', 'q2', 'q3'], problemIds: [], answers, passed: new Map(), dueAt: DUE }).percent).toBe(67);
  });

  it('treats an empty set as 0% rather than dividing by zero', () => {
    expect(scoreSet({ questionIds: [], problemIds: [], answers: new Map(), passed: new Map(), dueAt: DUE }).percent).toBe(0);
  });
});

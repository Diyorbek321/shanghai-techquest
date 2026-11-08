import { describe, expect, it } from 'vitest';
import { eveningNotice, morningNotice, noticePhase, shouldRemind, tashkentHour } from './dispatch';
import type { EvaluatedItem } from './planner';

/** A UTC instant that is `hour`:00 in Tashkent (UTC+5). */
const atTashkent = (hour: number) => new Date(Date.UTC(2026, 10, 8, hour - 5));

const items: EvaluatedItem[] = [
  { kind: 'problem', problemId: 'p1', done: true },
  { kind: 'problem', problemId: 'p2', done: false },
  { kind: 'quiz', questionIds: ['q1', 'q2', 'q3'], done: false, answeredCorrectly: 1, total: 3 },
];

describe('noticePhase', () => {
  it('reads the hour on Tashkent time, not UTC', () => {
    expect(tashkentHour(atTashkent(7))).toBe(7);
    expect(tashkentHour(new Date(Date.UTC(2026, 10, 8, 20)))).toBe(1);
  });

  it('stays quiet at night, then morning, then evening', () => {
    expect(noticePhase(atTashkent(6))).toBe('none');
    expect(noticePhase(atTashkent(7))).toBe('morning');
    expect(noticePhase(atTashkent(11))).toBe('morning');
    expect(noticePhase(atTashkent(12))).toBe('none');
    expect(noticePhase(atTashkent(18))).toBe('none');
    expect(noticePhase(atTashkent(19))).toBe('evening');
    expect(noticePhase(atTashkent(23))).toBe('evening');
  });
});

describe('notices', () => {
  it('morning notice lists the work and the reward', () => {
    const notice = morningNotice(items, false, 30);
    expect(notice.body).toContain('2 ta masala va 3 savollik test');
    expect(notice.body).toContain('+30 XP');
  });

  it('morning notice on a lesson day says it is short', () => {
    expect(morningNotice([items[2]], true, 30).body).toContain('dars kuni');
  });

  it('evening notice shows progress and the streak at stake', () => {
    const notice = eveningNotice(items, 4);
    expect(notice.body).toContain('3 tadan 1 tasi');
    expect(notice.body).toContain('4 kunlik');
  });

  it('evening notice without a streak does not mention losing one', () => {
    const notice = eveningNotice([items[1]], 0);
    expect(notice.body).not.toContain('uziladi');
    expect(notice.body).not.toContain('tadan');
  });
});

describe('shouldRemind', () => {
  const date = '2026-11-08';

  it('reminds a student who got the morning notice', () => {
    expect(shouldRemind({ date, createdAt: atTashkent(20), notifiedAt: atTashkent(7) })).toBe(true);
  });

  it('reminds when the plan existed since the afternoon, even unannounced', () => {
    expect(shouldRemind({ date, createdAt: atTashkent(14), notifiedAt: null })).toBe(true);
  });

  it('stays quiet about a plan that only appeared in the evening', () => {
    expect(shouldRemind({ date, createdAt: atTashkent(19), notifiedAt: null })).toBe(false);
  });
});

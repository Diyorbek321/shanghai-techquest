import { describe, expect, it } from 'vitest';
import { earnedCertificates, nextMilestone, type LessonCompletion } from './eligibility';

const lesson = (month: number, section: string, completed: boolean, key = `l${month}-${section}-${completed}`): LessonCompletion =>
  ({ key, month, section, completed });

const monthOfThree = (month: number, section: string, done: number) =>
  [0, 1, 2].map((i) => lesson(month, section, i < done, `l${month}-${i}`));

describe('earnedCertificates', () => {
  it('issues nothing for an empty curriculum', () => {
    expect(earnedCertificates([])).toEqual([]);
  });

  // A certificate says the course was completed. Issuing one at 2/3 would make
  // the document say something the student then has to explain away.
  it('does not issue a month certificate while any lesson is unfinished', () => {
    expect(earnedCertificates(monthOfThree(1, 'Asoslar', 2))).toEqual([]);
  });

  // A single-month curriculum that is fully done earns BOTH: the month, and the
  // course it constitutes. The course line is not a duplicate of the month one.
  it('issues a month certificate when every lesson in it is done', () => {
    const earned = earnedCertificates(monthOfThree(1, 'Asoslar', 3));
    expect(earned.map((c) => c.kind)).toEqual(['month', 'course']);
    expect(earned[0]).toMatchObject({ kind: 'month', month: 1, lessonsCompleted: 3, lessonsTotal: 3 });
    expect(earned[0].title).toContain('Asoslar');
  });

  it('issues only the finished months when later ones are incomplete', () => {
    const earned = earnedCertificates([...monthOfThree(1, 'Asoslar', 3), ...monthOfThree(2, 'Sikllar', 1)]);
    expect(earned.map((c) => c.month)).toEqual([1]);
  });

  it('adds the course certificate once every month is done', () => {
    const earned = earnedCertificates([...monthOfThree(1, 'Asoslar', 3), ...monthOfThree(2, 'Sikllar', 3)]);
    expect(earned.map((c) => c.kind)).toEqual(['month', 'month', 'course']);
    expect(earned[2]).toMatchObject({ month: null, lessonsCompleted: 6, lessonsTotal: 6 });
  });

  it('names a month after its most common section, not its last one', () => {
    const mixed = [
      lesson(1, 'Sikllar', true, 'a'),
      lesson(1, 'Sikllar', true, 'b'),
      lesson(1, 'MINI-LOYIHA', true, 'c'),
    ];
    expect(earnedCertificates(mixed)[0].title).toContain('Sikllar');
  });
});

describe('nextMilestone', () => {
  it('points at the first unfinished month', () => {
    const lessons = [...monthOfThree(1, 'Asoslar', 3), ...monthOfThree(2, 'Sikllar', 1)];
    expect(nextMilestone(lessons)).toEqual({ month: 2, completed: 1, total: 3 });
  });

  it('returns null when the whole course is done', () => {
    expect(nextMilestone(monthOfThree(1, 'Asoslar', 3))).toBeNull();
  });
});

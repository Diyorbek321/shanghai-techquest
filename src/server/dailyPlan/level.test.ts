import { describe, expect, it } from 'vitest';
import { difficultyRank, studentLevel, summarizeWork } from './level';

describe('studentLevel', () => {
  it('stays normal until there is enough work to judge', () => {
    expect(studentLevel({ attempted: 2, solved: 0, submissions: 20 })).toBe('normal');
  });

  it('marks a student who solves less than half as struggling', () => {
    expect(studentLevel({ attempted: 6, solved: 2, submissions: 10 })).toBe('struggling');
  });

  it('marks a student who needs many tries per problem as struggling', () => {
    expect(studentLevel({ attempted: 4, solved: 4, submissions: 20 })).toBe('struggling');
  });

  it('marks a student who solves almost everything quickly as strong', () => {
    expect(studentLevel({ attempted: 10, solved: 10, submissions: 14 })).toBe('strong');
  });

  it('keeps the middle normal', () => {
    expect(studentLevel({ attempted: 6, solved: 5, submissions: 15 })).toBe('normal');
  });
});

describe('summarizeWork', () => {
  it('counts distinct problems, solved ones and all submissions', () => {
    expect(
      summarizeWork([
        { problemId: 'a', passed: false },
        { problemId: 'a', passed: true },
        { problemId: 'b', passed: false },
      ])
    ).toEqual({ attempted: 2, solved: 1, submissions: 3 });
  });
});

describe('difficultyRank', () => {
  it('ranks known difficulties and puts unknown ones in the middle', () => {
    expect(difficultyRank('EASY')).toBeLessThan(difficultyRank('HARD'));
    expect(difficultyRank(undefined)).toBe(difficultyRank('MEDIUM'));
  });
});

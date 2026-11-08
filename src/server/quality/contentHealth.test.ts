import { describe, expect, it } from 'vitest';
import { classifyProblem, classifyQuestion, findContentIssues, type ProblemStats, type QuestionStats } from './contentHealth';

const problem = (over: Partial<ProblemStats> = {}): ProblemStats => ({
  id: 'p',
  title: 'Masala',
  difficulty: 'MEDIUM',
  lessonOrder: 3,
  lessonTitle: 'Dars',
  testCount: 3,
  attempted: 10,
  solved: 6,
  submissions: 20,
  ...over,
});

const question = (over: Partial<QuestionStats> = {}): QuestionStats => ({
  id: 'q',
  prompt: 'Savol',
  lessonOrder: 2,
  lessonTitle: 'Dars',
  students: 10,
  timesSeen: 20,
  timesCorrect: 15,
  ...over,
});

describe('classifyProblem', () => {
  it('leaves a healthy problem alone', () => {
    expect(classifyProblem(problem())).toBeNull();
  });

  it('flags a problem without tests even if nobody tried it', () => {
    expect(classifyProblem(problem({ testCount: 0, attempted: 0, solved: 0 }))?.flag).toBe('no_tests');
  });

  it('ignores small samples', () => {
    expect(classifyProblem(problem({ attempted: 4, solved: 0 }))).toBeNull();
  });

  it('flags a problem nobody solves as high', () => {
    const f = classifyProblem(problem({ solved: 0 }));
    expect(f).toMatchObject({ flag: 'nobody_solves', severity: 'high' });
  });

  it('treats an EASY problem with a low solve rate as more serious', () => {
    expect(classifyProblem(problem({ difficulty: 'EASY', solved: 2 }))).toMatchObject({
      flag: 'easy_but_unsolved',
      severity: 'high',
    });
    expect(classifyProblem(problem({ difficulty: 'HARD', solved: 2 }))).toMatchObject({
      flag: 'low_solve_rate',
      severity: 'medium',
    });
  });
});

describe('classifyQuestion', () => {
  it('leaves a healthy question alone', () => {
    expect(classifyQuestion(question())).toBeNull();
  });

  it('ignores small samples', () => {
    expect(classifyQuestion(question({ students: 3, timesCorrect: 0 }))).toBeNull();
  });

  it('grades a mostly-wrong question by how bad it is', () => {
    expect(classifyQuestion(question({ timesCorrect: 5 }))?.severity).toBe('medium');
    expect(classifyQuestion(question({ timesCorrect: 2 }))?.severity).toBe('high');
  });
});

describe('findContentIssues', () => {
  it('orders high before medium, then by lesson', () => {
    const issues = findContentIssues(
      [problem({ id: 'late-high', lessonOrder: 9, solved: 0 }), problem({ id: 'medium', lessonOrder: 1, solved: 2 })],
      [question({ id: 'early-high', lessonOrder: 2, timesCorrect: 1 })]
    );
    expect(issues.map((i) => i.id)).toEqual(['early-high', 'late-high', 'medium']);
  });
});

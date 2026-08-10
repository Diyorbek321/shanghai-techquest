import { describe, expect, it } from 'vitest';
import { buildParentReport, type WeekCounts } from './report';

const counts = (over: Partial<WeekCounts> = {}): WeekCounts => ({
  lessonsCompleted: 0,
  problemsSolved: 0,
  quizAnswered: 0,
  quizCorrect: 0,
  dailyExercises: 0,
  streak: 0,
  strongestTopic: null,
  ...over,
});

/** Words that turn a report into a charge sheet. */
const CONTROLLING = ['bajarmadi', 'qoldirdi', 'kechikdi', 'majbur', 'talab qiling', "o'tirtiring"];

describe('buildParentReport', () => {
  it('reports what was done, with the topic and the quiz rate', () => {
    const report = buildParentReport('Ali', counts({
      lessonsCompleted: 3,
      problemsSolved: 7,
      quizAnswered: 20,
      quizCorrect: 15,
      strongestTopic: 'sikllar',
    }));

    expect(report.headline).toContain('3 ta darsni yakunladi');
    expect(report.headline).toContain('7 ta masala yechdi');
    expect(report.highlights.join(' ')).toContain('sikllar');
    expect(report.highlights.join(' ')).toContain('75%');
  });

  // The documented harm: a parent handed a list of failures responds with
  // supervision, and intrusive involvement has a NEGATIVE association with
  // achievement. So nothing here counts what was missed.
  it('never counts what was missed, even in an empty week', () => {
    const report = buildParentReport('Ali', counts());
    const text = [report.headline, ...report.highlights, ...report.conversationStarters].join(' ').toLowerCase();

    for (const word of CONTROLLING) expect(text).not.toContain(word);
  });

  it('turns an empty week into an invitation rather than a verdict', () => {
    const report = buildParentReport('Ali', counts());
    expect(report.conversationStarters.length).toBeGreaterThan(0);
    expect(report.conversationStarters.join(' ')).toContain('qiyin');
  });

  it('always ends with questions to ask, never instructions to enforce', () => {
    const busy = buildParentReport('Ali', counts({ problemsSolved: 4, strongestTopic: 'ro\'yxatlar' }));
    for (const starter of busy.conversationStarters) expect(starter.trim().endsWith('?')).toBe(true);
  });

  it('omits the quiz line when nothing was answered, rather than showing 0%', () => {
    const report = buildParentReport('Ali', counts({ problemsSolved: 1 }));
    expect(report.highlights.join(' ')).not.toContain('%');
  });

  it('never compares the child with classmates', () => {
    const report = buildParentReport('Ali', counts({ lessonsCompleted: 2, streak: 5 }));
    const text = [report.headline, ...report.highlights].join(' ').toLowerCase();
    expect(text).not.toContain('sinfda');
    expect(text).not.toContain("o'rin");
  });
});

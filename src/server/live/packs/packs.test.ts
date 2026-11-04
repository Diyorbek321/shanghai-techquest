import { describe, expect, it } from 'vitest';
import { findPack, QUESTION_PACKS, toLiveQuestion } from './index';

// The answer key printed at the end of the teacher's PDF, questions 1..50.
const PDF_KEY = 'BAAABABAAAAAAAAAABAAAAABAABABABABABABBBCCBACABBBCA';
const PDF_CORRECT: Record<number, string> = {
  1: 'Neither', 7: 'do', 18: 'know', 24: 'was he', 27: 'getting', 40: 'used to run',
  41: 'to working', 44: 'She is used to play piano.', 49: 'being recognized', 50: 'will have got used to',
};

describe('question packs', () => {
  const all = findPack('en-so-neither-used-to')!;

  it('has the 50 PDF questions split 25 / 25', () => {
    expect(all.questions).toHaveLength(50);
    expect(findPack('en-so-neither')!.questions).toHaveLength(25);
    expect(findPack('en-used-to')!.questions).toHaveLength(25);
    expect(PDF_KEY).toHaveLength(50);
  });

  it('keeps the correct answers from the PDF key', () => {
    for (const [n, answer] of Object.entries(PDF_CORRECT)) {
      const q = all.questions[Number(n) - 1];
      expect(q.choices[q.correctIndex]).toBe(answer);
    }
  });

  it('gives every question four distinct choices and one valid answer', () => {
    for (const pack of QUESTION_PACKS) {
      for (const q of pack.questions) {
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.explanation.length).toBeGreaterThan(0);
      }
    }
  });

  it('spreads the correct answer over all four tiles', () => {
    const positions = new Set(all.questions.map((q) => q.correctIndex));
    expect(positions.size).toBe(4);
  });

  it('shuffles deterministically per question id', () => {
    const raw = ['p', ['right', 'w1', 'w2', 'w3'], 'e'] as const;
    const a = toLiveQuestion('pack:x:1', raw);
    expect(toLiveQuestion('pack:x:1', raw)).toEqual(a);
    expect(a.choices[a.correctIndex]).toBe('right');
    expect([...a.choices].sort()).toEqual(['right', 'w1', 'w2', 'w3']);
  });

  it('uses unique keys and question ids', () => {
    expect(new Set(QUESTION_PACKS.map((p) => p.key)).size).toBe(QUESTION_PACKS.length);
    for (const pack of QUESTION_PACKS) {
      expect(new Set(pack.questions.map((q) => q.id)).size).toBe(pack.questions.length);
    }
    expect(findPack('no-such-pack')).toBeUndefined();
  });
});

describe('vocabulary packs (Shanghai School Test 1–10)', () => {
  const tests = Array.from({ length: 10 }, (_, i) => findPack(`en-vocab-${String(i + 1).padStart(2, '0')}`)!);
  const all = findPack('en-vocab-all')!;
  const answer = (q: { choices: readonly string[]; correctIndex: number }) => q.choices[q.correctIndex];

  it('has ten 50-question tests and one 500-question pack with every word once', () => {
    for (const pack of tests) expect(pack.questions).toHaveLength(50);
    expect(all.questions).toHaveLength(500);
    expect(all.questions.map(answer)).toEqual(tests.flatMap((p) => p.questions.map(answer)));
  });

  it('keeps answers from the PDFs', () => {
    expect(tests[0].questions[0].prompt).toContain('I finally ___ my dream');
    expect(answer(tests[0].questions[0])).toBe('achieved');
    expect(answer(tests[0].questions[1])).toBe('acquire');
    expect(answer(tests[0].questions[2])).toBe('adapt');
    expect(tests[9].questions[49].explanation).toMatch(/^conclusion — xulosa/);
  });

  it('mixes question types across the words', () => {
    const kinds = ['😂', '📖', '🔤', '🌐', '🔁', '⚔️'];
    for (const kind of kinds) {
      expect(all.questions.filter((q) => q.prompt.startsWith(kind)).length).toBeGreaterThan(30);
    }
  });

  it('never shows two case-insensitively equal choices', () => {
    for (const q of all.questions) {
      expect(new Set(q.choices.map((c) => c.toLowerCase())).size).toBe(4);
    }
  });
});

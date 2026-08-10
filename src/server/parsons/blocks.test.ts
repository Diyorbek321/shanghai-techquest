import { describe, expect, it } from 'vitest';
import { buildBoard, gradeOrder, isParsonsSuitable, MAX_PARSONS_LINES, seedFrom, toLines } from './blocks';

const SOLUTION = [
  'n = int(input())',
  'total = 0',
  'for i in range(1, n + 1):',
  '    total += i',
  'print(total)',
].join('\n');

describe('toLines', () => {
  it('drops blank lines and trailing whitespace but keeps indentation', () => {
    expect(toLines('a = 1\n\n  b = 2   \n\n')).toEqual(['a = 1', '  b = 2']);
  });

  it('keeps comment lines, which carry the step structure', () => {
    expect(toLines('# birinchi qadam\nx = 1')).toEqual(['# birinchi qadam', 'x = 1']);
  });

  it('normalises CRLF', () => {
    expect(toLines('a = 1\r\nb = 2')).toEqual(['a = 1', 'b = 2']);
  });
});

describe('buildBoard', () => {
  it('is stable for the same seed and different across seeds', () => {
    const a = buildBoard(SOLUTION, seedFrom('p1:u1'));
    const b = buildBoard(SOLUTION, seedFrom('p1:u1'));
    const c = buildBoard(SOLUTION, seedFrom('p1:u2'));

    expect(a.map((x) => x.text)).toEqual(b.map((x) => x.text));
    expect(a.map((x) => x.text)).not.toEqual(c.map((x) => x.text));
  });

  it('contains every solution line exactly once', () => {
    const board = buildBoard(SOLUTION, seedFrom('seed'));
    expect([...board.map((b) => b.text)].sort()).toEqual([...toLines(SOLUTION)].sort());
  });

  // The answer must not be readable off the wire.
  it('gives out ids that do not encode the correct position', () => {
    const board = buildBoard(SOLUTION, seedFrom('seed'));
    for (const block of board) expect(block.id).not.toMatch(/^b?\d+$/);
  });

  it('never hands back an already-solved board', () => {
    const lines = toLines(SOLUTION);
    for (let s = 0; s < 200; s += 1) {
      expect(buildBoard(SOLUTION, s).map((b) => b.text)).not.toEqual(lines);
    }
  });

  it('returns a one-line solution untouched', () => {
    expect(buildBoard('print(1)', 7).map((b) => b.text)).toEqual(['print(1)']);
  });
});

describe('gradeOrder', () => {
  it('accepts the exact solution', () => {
    const grade = gradeOrder(SOLUTION, toLines(SOLUTION));
    expect(grade).toMatchObject({ correct: true, linesCorrect: 5, linesTotal: 5, wrongPositions: [] });
  });

  it('reports which positions are wrong without revealing the answer', () => {
    const wrong = [...toLines(SOLUTION)];
    [wrong[1], wrong[2]] = [wrong[2], wrong[1]];
    const grade = gradeOrder(SOLUTION, wrong);

    expect(grade.correct).toBe(false);
    expect(grade.linesCorrect).toBe(3);
    expect(grade.wrongPositions).toEqual([2, 3]);
  });

  // Duplicate lines are interchangeable — the student built the right program.
  it('accepts a swap of two identical lines', () => {
    const dup = 'print("x")\nprint("x")\nprint("done")';
    expect(gradeOrder(dup, ['print("x")', 'print("x")', 'print("done")']).correct).toBe(true);
  });

  it('rejects a short submission', () => {
    const grade = gradeOrder(SOLUTION, toLines(SOLUTION).slice(0, 3));
    expect(grade.correct).toBe(false);
    expect(grade.linesCorrect).toBe(3);
  });

  it('rejects extra cards even when every expected line is placed', () => {
    const grade = gradeOrder(SOLUTION, [...toLines(SOLUTION), 'print(total)']);
    expect(grade.correct).toBe(false);
    expect(grade.wrongPositions).toContain(6);
  });

  it('treats indentation as part of the answer', () => {
    const flat = toLines(SOLUTION).map((l) => l.trim());
    expect(gradeOrder(SOLUTION, flat).correct).toBe(false);
  });
});

describe('isParsonsSuitable', () => {
  const lines = (n: number) => Array.from({ length: n }, (_, i) => `print(${i})`).join('\n');

  it('offers a solution of a workable size', () => {
    expect(isParsonsSuitable(lines(2))).toBe(true);
    expect(isParsonsSuitable(lines(12))).toBe(true);
    expect(isParsonsSuitable(lines(MAX_PARSONS_LINES))).toBe(true);
  });

  // Past the ceiling the puzzle costs more than writing the program, and the
  // student it exists for is the first to drown in it.
  it('withholds a solution too long to shuffle usefully', () => {
    expect(isParsonsSuitable(lines(MAX_PARSONS_LINES + 1))).toBe(false);
    expect(isParsonsSuitable(lines(46))).toBe(false);
  });

  it('withholds anything that cannot be shuffled at all', () => {
    expect(isParsonsSuitable(lines(1))).toBe(false);
    expect(isParsonsSuitable('')).toBe(false);
    expect(isParsonsSuitable(null)).toBe(false);
    expect(isParsonsSuitable(undefined)).toBe(false);
  });

  // Blank lines are dropped before shuffling, so they must not count toward
  // the ceiling — otherwise spacing alone could withhold a short solution.
  it('counts only the lines that become cards', () => {
    const padded = lines(MAX_PARSONS_LINES).split('\n').join('\n\n');
    expect(isParsonsSuitable(padded)).toBe(true);
  });
});


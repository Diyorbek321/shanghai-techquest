import { describe, expect, it } from 'vitest';
import { detectLeftoverStarter } from './starterHint';

const STARTER = [
  'from datetime import datetime',
  '',
  "# 1-qatordan sanani o'qing (YYYY-MM-DD)",
  'matn = input()',
  '# strptime bilan ... chiqaring',
].join('\n');

// Real production pattern: the solution was written BELOW the untouched starter.
const PASTED_BELOW = [
  STARTER,
  'from datetime import datetime',
  '',
  'sana = input()',
  'sana = datetime.strptime(sana, "%Y-%m-%d")',
  'print(sana.strftime("%d.%m.%Y"))',
].join('\n');

const COMPLETED_IN_PLACE = [
  'from datetime import datetime',
  '',
  'matn = input()',
  'sana = datetime.strptime(matn, "%Y-%m-%d")',
  'print(sana.strftime("%d.%m.%Y"))',
].join('\n');

describe('detectLeftoverStarter', () => {
  it('flags a solution pasted under the starter (duplicate import + starter input kept)', () => {
    expect(detectLeftoverStarter(STARTER, PASTED_BELOW, [])).toBe(true);
  });

  it('flags it from an EOFError even without duplicate headers', () => {
    const code = `${STARTER}\nsana = input()\nprint(sana)`;
    expect(detectLeftoverStarter(STARTER, code, ['Traceback ...\nEOFError: EOF when reading a line'])).toBe(true);
  });

  it('does not flag a starter that was completed in place', () => {
    expect(detectLeftoverStarter(STARTER, COMPLETED_IN_PLACE, [])).toBe(false);
  });

  it('does not flag when the starter input line was removed', () => {
    const code = 'from datetime import datetime\nfrom datetime import datetime\nprint(1)';
    expect(detectLeftoverStarter(STARTER, code, ['EOFError'])).toBe(false);
  });

  it('ignores starters without a live input() line', () => {
    expect(detectLeftoverStarter('# ism = input()\n', 'ism = input()\nism = input()', ['EOFError'])).toBe(false);
    expect(detectLeftoverStarter(null, 'x = input()', ['EOFError'])).toBe(false);
  });

  it('flags a duplicated def header too', () => {
    const starter = 'def profil(**m):\n    pass\n\nn = int(input())\n';
    const code = `${starter}def profil(**m):\n    print(m)\n\nn = int(input())\n`;
    expect(detectLeftoverStarter(starter, code, [])).toBe(true);
  });
});

/**
 * Most common real failure on daily homework (seen in production submissions):
 * the student keeps the starter code — which already calls `input()` — and
 * writes a complete solution BELOW it. The starter then swallows the first
 * stdin line, the solution reads the wrong line, and every test fails even
 * though the solution itself is correct. The student only sees "0/N", so we
 * detect this shape and say exactly what to change.
 */

const HEADER = /^(import\s|from\s+\S+\s+import\s|def\s|class\s)/;

function liveLines(code: string): string[] {
  return code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

/** A top-level import/def/class line that appears twice means code was written twice. */
function hasDuplicatedHeader(code: string): boolean {
  const seen = new Set<string>();
  for (const line of code.split('\n')) {
    if (line !== line.trimStart()) continue; // top level only
    const trimmed = line.trim();
    if (!HEADER.test(trimmed)) continue;
    if (seen.has(trimmed)) return true;
    seen.add(trimmed);
  }
  return false;
}

export function detectLeftoverStarter(
  starter: string | null,
  code: string,
  visibleStderr: readonly string[]
): boolean {
  if (!starter) return false;
  const starterInputs = liveLines(starter).filter((line) => line.includes('input('));
  if (starterInputs.length === 0) return false;

  const codeLines = new Set(liveLines(code));
  const keptStarterInput = starterInputs.some((line) => codeLines.has(line));
  if (!keptStarterInput) return false;

  const ranOutOfInput = visibleStderr.some((stderr) => stderr.includes('EOFError'));
  return ranOutOfInput || hasDuplicatedHeader(code);
}

export const LEFTOVER_STARTER_FEEDBACK =
  "Diqqat: yechimingiz boshlang'ich kodning OSTIGA yozilganga o'xshaydi. Boshlang'ich koddagi `input()` " +
  "qatori ham ishlab, kiritmaning birinchi qatorini o'qib qo'yadi — shuning uchun sizning kodingiz noto'g'ri " +
  "qatorni oladi. Boshlang'ich koddagi `input()` qatorlarini (yoki takrorlangan qismni) o'chiring, yoki " +
  "yechimni boshlang'ich kodning ichida davom ettiring.";

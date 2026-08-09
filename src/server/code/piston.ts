import { env } from '../env';

export type RunLanguage = 'javascript' | 'python' | 'cpp';

interface LanguageTarget {
  language: string;
  version: string;
  filename: string;
}

const LANGUAGE_TARGETS: Record<RunLanguage, LanguageTarget> = {
  javascript: { language: 'javascript', version: '18.15.0', filename: 'main.js' },
  python: { language: 'python', version: '3.10.0', filename: 'main.py' },
  cpp: { language: 'c++', version: '10.2.0', filename: 'main.cpp' },
};

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string | null;
  timedOut: boolean;
}

export class PistonUnavailableError extends Error {}

const EXECUTE_TIMEOUT_MS = 15_000;
const MAX_OUTPUT_CHARS = 8_000;

function truncate(text: string): string {
  return text.length > MAX_OUTPUT_CHARS ? `${text.slice(0, MAX_OUTPUT_CHARS)}\n... (natija qisqartirildi)` : text;
}

interface PistonExecuteResponse {
  compile?: { stdout?: string; stderr?: string; code?: number | null };
  run?: { stdout?: string; stderr?: string; signal?: string | null };
}

export async function executeCode(language: RunLanguage, code: string, stdin: string): Promise<ExecutionResult> {
  const target = LANGUAGE_TARGETS[language];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EXECUTE_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${env.pistonUrl}/api/v2/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: target.language,
        version: target.version,
        files: [{ name: target.filename, content: code }],
        stdin,
      }),
      signal: controller.signal,
    });
  } catch {
    throw new PistonUnavailableError('Kod ishga tushirish xizmati mavjud emas.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Piston execute request rejected:', response.status, detail);
    throw new PistonUnavailableError('Kod ishga tushirish xizmati xatolik qaytardi.');
  }

  const data = (await response.json()) as PistonExecuteResponse;
  const compileText = `${data.compile?.stdout ?? ''}${data.compile?.stderr ?? ''}`.trim();
  // A failed compile step (e.g. C++) makes Piston mirror the same compiler
  // errors into `run.std{out,err}` since there's no binary left to execute —
  // showing that twice (once as "compile", once as "run") is just noise.
  const compileFailed = (data.compile?.code ?? 0) !== 0;

  return {
    stdout: compileFailed ? '' : truncate(data.run?.stdout ?? ''),
    stderr: compileFailed ? '' : truncate(data.run?.stderr ?? ''),
    compileOutput: compileText.length > 0 ? truncate(compileText) : null,
    timedOut: data.run?.signal === 'SIGKILL',
  };
}

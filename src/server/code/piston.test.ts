import { afterEach, describe, expect, it, vi } from 'vitest';
import { executeCode, PistonUnavailableError } from './piston';

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('executeCode', () => {
  it('returns stdout from a successful run', async () => {
    mockFetchOnce(200, { run: { stdout: 'hi\n', stderr: '', signal: null } });

    const result = await executeCode('javascript', 'console.log("hi")', '');

    expect(result).toEqual({ stdout: 'hi\n', stderr: '', compileOutput: null, timedOut: false });
  });

  it('reports timedOut when the run is killed by SIGKILL', async () => {
    mockFetchOnce(200, { run: { stdout: '', stderr: '', signal: 'SIGKILL' } });

    const result = await executeCode('javascript', 'while(true){}', '');

    expect(result.timedOut).toBe(true);
  });

  it('surfaces compiler errors and suppresses the duplicated run stderr on a failed compile', async () => {
    mockFetchOnce(200, {
      compile: { stdout: '', stderr: 'main.cpp: error: expected \';\'', code: 1 },
      run: { stdout: '', stderr: 'main.cpp: error: expected \';\'', signal: null },
    });

    const result = await executeCode('cpp', 'int main() {', '');

    expect(result.compileOutput).toContain('expected');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });

  it('throws PistonUnavailableError when the request fails outright', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));

    await expect(executeCode('javascript', '1', '')).rejects.toThrow(PistonUnavailableError);
  });

  it('throws PistonUnavailableError when Piston responds with a non-2xx status', async () => {
    mockFetchOnce(400, { message: 'run_timeout cannot exceed the configured limit of 3000' });

    await expect(executeCode('javascript', '1', '')).rejects.toThrow(PistonUnavailableError);
  });

  it('truncates very long output', async () => {
    mockFetchOnce(200, { run: { stdout: 'x'.repeat(9000), stderr: '', signal: null } });

    const result = await executeCode('javascript', 'loop', '');

    expect(result.stdout.length).toBeLessThan(9000);
    expect(result.stdout).toContain('qisqartirildi');
  });
});

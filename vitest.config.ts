import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
    // Every server test runs against the one real Postgres database, so test
    // files share global rows rather than isolated fixtures. Running them in
    // parallel is genuinely racy: syncLessonAssignments() sweeps *every* lesson
    // on a track, so it would pick up another file's temporary lessons and then
    // hit Assignment_lessonId_fkey the moment that file's afterAll deleted them.
    // The suite is only a few seconds long, so determinism is worth more than
    // the parallelism here.
    fileParallelism: false,
  },
});

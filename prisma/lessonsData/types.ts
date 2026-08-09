/**
 * Shape of one lesson extracted from a `.pptx` deck by `scripts/extractLessons.ts`.
 * The generated data files (`backend.ts`, `backendProblems.ts`) conform to these types.
 */
export interface LessonRecord {
  /** Stable identifier, e.g. `backend-dars-01`. */
  key: string;
  /** 1..96 — position in the whole course. */
  order: number;
  /** 1..8 */
  month: number;
  /** 1..32 */
  week: number;
  title: string;
  /** Curriculum section printed on slide 1, e.g. "Python asoslari". */
  section: string;
  /** One-line hook from slide 1. */
  summary: string;
  /** The three takeaways from the XULOSA slide. */
  objectives: string[];
  /** ASOSIY TOPSHIRIQ (60%) from the UY VAZIFASI slide. */
  homeworkMain: string;
  /** TAKRORLASH (40%) checklist items. */
  homeworkReview: string[];
  /** Submission instructions printed under the homework. */
  homeworkNote: string;
  /** M — MAKE tiers (OSON / O'RTA / QIYIN). */
  makeEasy: string;
  makeMedium: string;
  makeHard: string;
  /** TEKSHIRUV — five recap questions. */
  quiz: string[];
  /** KEYINGI DARS — topic of the next lesson. */
  nextTopic: string | null;
  /** O'YLAB KELING — thinking prompt for the next lesson. */
  nextPrompt: string | null;
  /** File name inside `lesson-assets/backend/`. */
  slideFile: string;
  /** Every 12th lesson closes a month with a project. */
  kind: 'lesson' | 'project';
  xpReward: number;
}

/**
 * One I/O test case for a practice problem.
 *
 * The runner feeds `stdin` to the submitted program and compares its stdout to
 * `expectedStdout`. Comparison is whitespace-forgiving: trailing whitespace is
 * trimmed from every line (and trailing blank lines are dropped) on both sides
 * before comparing, so students are not punished for a stray space or newline.
 * `hidden` cases are executed but never shown to the student; `label` is the
 * Uzbek caption displayed next to the result of a visible case.
 */
export interface ProblemTestCase {
  stdin: string;
  expectedStdout: string;
  hidden: boolean;
  label: string;
}

/**
 * One multiple-choice recap question attached to a lesson (the TEKSHIRUV slide,
 * reworked into an auto-gradable form). Seeded into the `QuizQuestion` table and
 * upserted on `(lessonId, order)`.
 *
 * `correctIndex` and `explanation` must NEVER be serialized to a student before
 * they answer — the API redacts them the same way `judge.ts` redacts hidden
 * test cases.
 */
export interface LessonQuizRecord {
  /** Lesson `key` this question belongs to, e.g. `backend-dars-01`. */
  lessonKey: string;
  /** 1..5 — position of the question inside the lesson. Unique per lesson. */
  order: number;
  /** The question text, in Uzbek. */
  prompt: string;
  /** Exactly four answer options, in Uzbek. */
  choices: [string, string, string, string];
  /** 0-based index into `choices` of the single correct option. */
  correctIndex: number;
  /** 1-2 Uzbek sentences explaining WHY the correct answer is correct. Shown after answering. */
  explanation: string;
}

export interface LessonProblemRecord {
  lessonKey: string;
  key: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  tags: string[];
  description: string;
  starterCodePy: string;
  /** Auto-graded I/O cases; at least one visible case is expected. */
  testCases: ProblemTestCase[];
}

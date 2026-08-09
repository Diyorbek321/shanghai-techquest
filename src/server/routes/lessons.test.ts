import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Difficulty, Role, SubmissionStatus, Track } from '@prisma/client';
import { createApp } from '../index';
import { prisma } from '../db';
import { signToken } from '../auth/jwt';
import { AUTH_COOKIE_NAME } from '../auth/cookies';
import { syncLessonAssignments } from '../lessons/syncAssignments';

const app = createApp();
const unique = (label: string) => `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function cookieFor(userId: string, role: Role, track: Track | null): string {
  return `${AUTH_COOKIE_NAME}=${signToken({ sub: userId, role, track })}`;
}

let backendStudentId: string;
let backendStudentCookie: string;
let frontendStudentCookie: string;
let teacherId: string;
let classId: string;
const lessonKeys = ['vitest-lesson-1', 'vitest-lesson-2', 'vitest-lesson-3'];

beforeAll(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const [backendStudent, frontendStudent, teacher] = await Promise.all([
    prisma.user.create({
      data: { email: `${unique('backend')}@vitest.local`, passwordHash, name: 'Backend Student', role: Role.STUDENT, track: Track.BACKEND },
    }),
    prisma.user.create({
      data: { email: `${unique('frontend')}@vitest.local`, passwordHash, name: 'Frontend Student', role: Role.STUDENT, track: Track.FRONTEND },
    }),
    prisma.user.create({
      data: { email: `${unique('teacher')}@vitest.local`, passwordHash, name: 'Teacher', role: Role.TEACHER },
    }),
  ]);
  backendStudentId = backendStudent.id;
  teacherId = teacher.id;
  backendStudentCookie = cookieFor(backendStudent.id, backendStudent.role, backendStudent.track);
  frontendStudentCookie = cookieFor(frontendStudent.id, frontendStudent.role, frontendStudent.track);

  // Three lessons far beyond the seeded 96 so they never collide on (track, order).
  await Promise.all(
    lessonKeys.map((key, index) =>
      prisma.lesson.create({
        data: {
          key,
          track: Track.BACKEND,
          order: 9000 + index,
          month: 99,
          week: 99,
          title: `Vitest dars ${index + 1}`,
          section: 'Vitest',
          summary: 'Test lesson',
          objectives: ['a', 'b', 'c'],
          homeworkMain: 'Asosiy topshiriq',
          homeworkReview: ['Takrorlash'],
          makeEasy: 'oson',
          makeMedium: "o'rta",
          makeHard: 'qiyin',
          quiz: ['q1'],
          slideFile: index === 0 ? 'nonexistent-deck.pptx' : null,
          kind: 'lesson',
          xpReward: 100,
        },
      })
    )
  );

  const classGroup = await prisma.classGroup.create({
    data: {
      title: unique('Vitest Backend'),
      track: Track.BACKEND,
      teacherId: teacher.id,
      startDate: new Date('2026-09-07T00:00:00.000Z'),
      lessonDays: [1, 3, 5],
    },
  });
  classId = classGroup.id;
  await prisma.enrollment.create({ data: { userId: backendStudent.id, classId } });
  await syncLessonAssignments(prisma, classId);
});

afterAll(async () => {
  await prisma.assignment.deleteMany({ where: { classId } });
  await prisma.classGroup.delete({ where: { id: classId } });
  await prisma.lesson.deleteMany({ where: { key: { in: lessonKeys } } });
  await prisma.user.deleteMany({ where: { id: { in: [backendStudentId, teacherId] } } });
  await prisma.$disconnect();
});

describe('GET /api/lessons', () => {
  it('requires authentication', async () => {
    await request(app).get('/api/lessons').expect(401);
  });

  it('groups a student\'s own track into months', async () => {
    const res = await request(app).get('/api/lessons').set('Cookie', backendStudentCookie).expect(200);
    const testMonth = res.body.months.find((m: { month: number }) => m.month === 99);
    expect(testMonth).toBeDefined();
    expect(testMonth.lessons).toHaveLength(3);
    expect(testMonth.total).toBe(3);
    expect(res.body.months.every((m: { lessons: { track: string }[] }) => m.lessons.every((l) => l.track === 'backend'))).toBe(true);
  });

  it('attaches the cohort deadline to each lesson', async () => {
    const res = await request(app).get('/api/lessons').set('Cookie', backendStudentCookie).expect(200);
    const lesson = res.body.months
      .flatMap((m: { lessons: { key: string; dueDate: string | null }[] }) => m.lessons)
      .find((l: { key: string }) => l.key === lessonKeys[0]);
    expect(lesson.dueDate).not.toBeNull();
    expect(lesson.assignmentId).not.toBeNull();
  });

  it('does not leak another track to a student', async () => {
    const res = await request(app).get('/api/lessons').set('Cookie', frontendStudentCookie).expect(200);
    const keys = res.body.months.flatMap((m: { lessons: { key: string }[] }) => m.lessons).map((l: { key: string }) => l.key);
    expect(keys).not.toContain(lessonKeys[0]);
  });
});

describe('GET /api/lessons/:key', () => {
  it('returns the homework the deck prescribes', async () => {
    const res = await request(app).get(`/api/lessons/${lessonKeys[0]}`).set('Cookie', backendStudentCookie).expect(200);
    expect(res.body.homeworkMain).toBe('Asosiy topshiriq');
    expect(res.body.homeworkReview).toEqual(['Takrorlash']);
    expect(res.body.make).toEqual({ easy: 'oson', medium: "o'rta", hard: 'qiyin' });
  });

  it('blocks a student from another track', async () => {
    await request(app).get(`/api/lessons/${lessonKeys[0]}`).set('Cookie', frontendStudentCookie).expect(403);
  });

  it('404s for an unknown lesson', async () => {
    await request(app).get('/api/lessons/no-such-lesson').set('Cookie', backendStudentCookie).expect(404);
  });
});

describe('GET /api/lessons/:key/slides', () => {
  it('requires authentication', async () => {
    await request(app).get(`/api/lessons/${lessonKeys[0]}/slides`).expect(401);
  });

  it('404s when the deck file is missing rather than serving something else', async () => {
    await request(app).get(`/api/lessons/${lessonKeys[0]}/slides`).set('Cookie', backendStudentCookie).expect(404);
  });

  it('404s when the lesson has no deck', async () => {
    await request(app).get(`/api/lessons/${lessonKeys[1]}/slides`).set('Cookie', backendStudentCookie).expect(404);
  });

  it('serves a real deck for a seeded lesson', async () => {
    const seeded = await prisma.lesson.findFirst({ where: { track: Track.BACKEND, order: 1 } });
    if (!seeded) return; // Database not seeded — the catalog test covers the data itself.
    const res = await request(app).get(`/api/lessons/${seeded.key}/slides`).set('Cookie', backendStudentCookie).expect(200);
    expect(res.headers['content-disposition']).toContain('attachment');
  });
});

// ---------------------------------------------------------------------------
// Mastery gating
//
// Runs on Track.OFFICE, which carries no seeded curriculum, so the fixture owns
// its own little catalog. Assertions only ever look at the SECOND lesson of a
// pair: its gate depends purely on the first lesson of that pair, which keeps
// the suite stable no matter what else lives in the OFFICE track.
// ---------------------------------------------------------------------------

const MASTERY_1 = 'vitest-mastery-1';
const MASTERY_2 = 'vitest-mastery-2';
const ZERO_1 = 'vitest-zeroproblem-1';
const ZERO_2 = 'vitest-zeroproblem-2';
const EMPTY_1 = 'vitest-empty-1';
const EMPTY_2 = 'vitest-empty-2';
const masteryLessonKeys = [MASTERY_1, MASTERY_2, ZERO_1, ZERO_2, EMPTY_1, EMPTY_2];

const QUIZ_COUNT = 5;

let officeStudentId: string;
let officeStudentCookie: string;
let lateStudentId: string;
let lateStudentCookie: string;
let officeTeacherId: string;
let officeTeacherCookie: string;
let officeClassIds: string[] = [];
let masteryLessonIds = new Map<string, string>();
let easyProblemId: string;
let mediumProblemId: string;
let hardProblemId: string;
let quizQuestionIds: string[] = [];
let zeroQuizQuestionIds: string[] = [];

type SummaryLesson = {
  key: string;
  unlocked: boolean;
  unlockedBy: 'first' | 'mastery' | 'deadline' | null;
  behind: boolean;
  mastery: {
    problemsPassed: number;
    problemsRequired: number;
    quizCorrect: number;
    quizTotal: number;
    mastered: boolean;
  };
};

async function officeCatalog(cookie: string, query = ''): Promise<Map<string, SummaryLesson>> {
  const res = await request(app).get(`/api/lessons${query}`).set('Cookie', cookie).expect(200);
  const lessons: SummaryLesson[] = res.body.months.flatMap((m: { lessons: SummaryLesson[] }) => m.lessons);
  return new Map(lessons.map((lesson) => [lesson.key, lesson]));
}

function lessonFixture(key: string, order: number, title: string) {
  return {
    key,
    track: Track.OFFICE,
    order,
    month: 97,
    week: 97,
    title,
    section: 'Vitest mastery',
    summary: 'Mastery test lesson',
    objectives: ['a'],
    homeworkMain: 'Asosiy topshiriq',
    homeworkReview: ['Takrorlash'],
    makeEasy: 'oson',
    makeMedium: "o'rta",
    makeHard: 'qiyin',
    quiz: ['q1'],
    kind: 'lesson',
    xpReward: 50,
  };
}

/** One assignment per lesson for a cohort, with a deadline we control exactly. */
async function seedAssignments(classId: string, dueDate: Date) {
  await Promise.all(
    masteryLessonKeys.map((key) =>
      prisma.assignment.create({
        data: {
          title: `Vitest ${key}`,
          description: 'Vitest',
          track: Track.OFFICE,
          classId,
          lessonId: masteryLessonIds.get(key)!,
          moduleKey: key,
          dueDate,
          xpReward: 50,
        },
      })
    )
  );
}

async function passProblem(problemId: string) {
  await prisma.problemSubmission.create({
    data: {
      problemId,
      userId: officeStudentId,
      code: 'print(1)',
      language: 'python',
      passed: true,
      feedback: 'Barcha testlar muvaffaqiyatli.',
      pointsAwarded: 10,
    },
  });
}

async function answerQuiz(questionId: string, correct: boolean) {
  await prisma.quizAttempt.upsert({
    where: { userId_questionId: { userId: officeStudentId, questionId } },
    create: {
      userId: officeStudentId,
      questionId,
      correct,
      streak: correct ? 1 : 0,
      timesSeen: 1,
      timesCorrect: correct ? 1 : 0,
      dueAt: new Date(Date.now() + 86_400_000),
    },
    update: { correct },
  });
}

describe('mastery-based unlocking', () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const [student, lateStudent, teacher] = await Promise.all([
      prisma.user.create({
        data: { email: `${unique('office')}@vitest.local`, passwordHash, name: 'Office Student', role: Role.STUDENT, track: Track.OFFICE },
      }),
      prisma.user.create({
        data: { email: `${unique('late')}@vitest.local`, passwordHash, name: 'Late Student', role: Role.STUDENT, track: Track.OFFICE },
      }),
      prisma.user.create({
        data: { email: `${unique('officeteacher')}@vitest.local`, passwordHash, name: 'Office Teacher', role: Role.TEACHER },
      }),
    ]);
    officeStudentId = student.id;
    lateStudentId = lateStudent.id;
    officeTeacherId = teacher.id;
    officeStudentCookie = cookieFor(student.id, student.role, student.track);
    lateStudentCookie = cookieFor(lateStudent.id, lateStudent.role, lateStudent.track);
    officeTeacherCookie = cookieFor(teacher.id, teacher.role, teacher.track);

    const lessons = await Promise.all([
      prisma.lesson.create({ data: lessonFixture(MASTERY_1, 9100, 'Mastery 1') }),
      prisma.lesson.create({ data: lessonFixture(MASTERY_2, 9101, 'Mastery 2') }),
      prisma.lesson.create({ data: lessonFixture(ZERO_1, 9110, 'Zero problem 1') }),
      prisma.lesson.create({ data: lessonFixture(ZERO_2, 9111, 'Zero problem 2') }),
      prisma.lesson.create({ data: lessonFixture(EMPTY_1, 9120, 'Empty 1') }),
      prisma.lesson.create({ data: lessonFixture(EMPTY_2, 9121, 'Empty 2') }),
    ]);
    masteryLessonIds = new Map(lessons.map((lesson) => [lesson.key, lesson.id]));

    // MASTERY_1 gets the full practice set; ZERO_1 gets a quiz but no problems;
    // EMPTY_1 stays deliberately bare (neither problems nor quiz).
    const [easy, medium, hard] = await Promise.all(
      ([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as const).map((difficulty, index) =>
        prisma.problem.create({
          data: {
            key: `${MASTERY_1}-${difficulty.toLowerCase()}`,
            title: `Mastery ${difficulty}`,
            difficulty,
            points: 10 * (index + 1),
            tags: ['vitest'],
            description: 'Vitest masala',
            starterCodePy: 'pass',
            lessonId: masteryLessonIds.get(MASTERY_1)!,
            testCases: [],
          },
        })
      )
    );
    easyProblemId = easy.id;
    mediumProblemId = medium.id;
    hardProblemId = hard.id;

    const questions = await Promise.all(
      Array.from({ length: QUIZ_COUNT }, (_, index) =>
        prisma.quizQuestion.create({
          data: {
            lessonId: masteryLessonIds.get(MASTERY_1)!,
            order: index + 1,
            prompt: `Savol ${index + 1}?`,
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            explanation: 'Izoh',
          },
        })
      )
    );
    quizQuestionIds = questions.map((question) => question.id);

    const zeroQuestions = await Promise.all(
      Array.from({ length: QUIZ_COUNT }, (_, index) =>
        prisma.quizQuestion.create({
          data: {
            lessonId: masteryLessonIds.get(ZERO_1)!,
            order: index + 1,
            prompt: `Savol ${index + 1}?`,
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            explanation: 'Izoh',
          },
        })
      )
    );
    zeroQuizQuestionIds = zeroQuestions.map((question) => question.id);

    const [onTimeClass, lateClass] = await Promise.all([
      prisma.classGroup.create({ data: { title: unique('Vitest Office'), track: Track.OFFICE, teacherId: teacher.id } }),
      prisma.classGroup.create({ data: { title: unique('Vitest Office Late'), track: Track.OFFICE, teacherId: teacher.id } }),
    ]);
    officeClassIds = [onTimeClass.id, lateClass.id];

    await Promise.all([
      prisma.enrollment.create({ data: { userId: student.id, classId: onTimeClass.id } }),
      prisma.enrollment.create({ data: { userId: lateStudent.id, classId: lateClass.id } }),
      seedAssignments(onTimeClass.id, new Date(Date.now() + 30 * 86_400_000)),
      seedAssignments(lateClass.id, new Date(Date.now() - 86_400_000)),
    ]);
  });

  afterAll(async () => {
    await prisma.quizAttempt.deleteMany({ where: { userId: officeStudentId } });
    await prisma.problemSubmission.deleteMany({ where: { userId: officeStudentId } });
    await prisma.submission.deleteMany({ where: { userId: { in: [officeStudentId, lateStudentId] } } });
    await prisma.assignment.deleteMany({ where: { classId: { in: officeClassIds } } });
    await prisma.classGroup.deleteMany({ where: { id: { in: officeClassIds } } });
    await prisma.lesson.deleteMany({ where: { key: { in: masteryLessonKeys } } });
    await prisma.user.deleteMany({ where: { id: { in: [officeStudentId, lateStudentId, officeTeacherId] } } });
  });

  it('locks the next lesson while the previous one has untouched practice', async () => {
    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(MASTERY_1)!.mastery).toEqual({
      problemsPassed: 0,
      problemsRequired: 2, // EASY + MEDIUM only — HARD is optional bonus work.
      quizCorrect: 0,
      quizTotal: QUIZ_COUNT,
      mastered: false,
    });
    expect(catalog.get(MASTERY_2)!.unlocked).toBe(false);
    expect(catalog.get(MASTERY_2)!.unlockedBy).toBeNull();
    expect(catalog.get(MASTERY_2)!.behind).toBe(false);
  });

  it('keeps the next lesson locked when practice passes but the quiz is under 60%', async () => {
    await passProblem(easyProblemId);
    await passProblem(mediumProblemId);
    await passProblem(hardProblemId);
    await answerQuiz(quizQuestionIds[0], true);
    await answerQuiz(quizQuestionIds[1], true);
    await answerQuiz(quizQuestionIds[2], false);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(MASTERY_1)!.mastery).toEqual({
      problemsPassed: 2,
      problemsRequired: 2,
      quizCorrect: 2, // 2/5 = 40% < 60%
      quizTotal: QUIZ_COUNT,
      mastered: false,
    });
    expect(catalog.get(MASTERY_2)!.unlocked).toBe(false);
  });

  it('unlocks the next lesson once practice passes and the quiz clears 60%', async () => {
    await answerQuiz(quizQuestionIds[2], true);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(MASTERY_1)!.mastery).toEqual({
      problemsPassed: 2,
      problemsRequired: 2,
      quizCorrect: 3, // 3/5 = 60%
      quizTotal: QUIZ_COUNT,
      mastered: true,
    });
    expect(catalog.get(MASTERY_2)!.unlocked).toBe(true);
    expect(catalog.get(MASTERY_2)!.unlockedBy).toBe('mastery');
    expect(catalog.get(MASTERY_2)!.behind).toBe(false);
  });

  it('exposes the same mastery block on the lesson detail endpoint', async () => {
    const res = await request(app).get(`/api/lessons/${MASTERY_1}`).set('Cookie', officeStudentCookie).expect(200);
    expect(res.body.mastery.mastered).toBe(true);
    expect(res.body.mastery.problemsRequired).toBe(2);
  });

  /** Hand in the cohort assignment for `moduleKey` as the office student. */
  async function handIn(moduleKey: string) {
    const assignment = await prisma.assignment.findFirstOrThrow({
      where: { classId: officeClassIds[0], moduleKey },
    });
    await prisma.submission.create({
      data: {
        assignmentId: assignment.id,
        userId: officeStudentId,
        githubUrl: 'https://github.com/example/repo',
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  it('keeps the next lesson locked when a zero-problem lesson is under 60% on its quiz', async () => {
    await answerQuiz(zeroQuizQuestionIds[0], true);
    await answerQuiz(zeroQuizQuestionIds[1], true);
    await answerQuiz(zeroQuizQuestionIds[2], false);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(ZERO_1)!.mastery).toEqual({
      problemsPassed: 0,
      problemsRequired: 0, // No authored practice — the quiz alone gates it.
      quizCorrect: 2, // 2/5 = 40% < 60%
      quizTotal: QUIZ_COUNT,
      mastered: false,
    });
    expect(catalog.get(ZERO_2)!.unlocked).toBe(false);
    expect(catalog.get(ZERO_2)!.unlockedBy).toBeNull();
  });

  it('does not unlock past a zero-problem lesson on a handed-in assignment alone', async () => {
    await handIn(ZERO_1);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(ZERO_1)!.mastery.mastered).toBe(false);
    expect(catalog.get(ZERO_2)!.unlocked).toBe(false);
    expect(catalog.get(ZERO_2)!.unlockedBy).toBeNull();
  });

  it('masters a zero-problem lesson on the quiz alone once it clears 60%', async () => {
    await answerQuiz(zeroQuizQuestionIds[2], true);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(ZERO_1)!.mastery).toEqual({
      problemsPassed: 0,
      problemsRequired: 0,
      quizCorrect: 3, // 3/5 = 60%
      quizTotal: QUIZ_COUNT,
      mastered: true,
    });
    expect(catalog.get(ZERO_2)!.unlocked).toBe(true);
    expect(catalog.get(ZERO_2)!.unlockedBy).toBe('mastery');
    expect(catalog.get(ZERO_2)!.behind).toBe(false);
  });

  it('never masters a lesson with neither problems nor quiz, even after a hand-in', async () => {
    await handIn(EMPTY_1);

    const catalog = await officeCatalog(officeStudentCookie);
    expect(catalog.get(EMPTY_1)!.mastery).toEqual({
      problemsPassed: 0,
      problemsRequired: 0,
      quizCorrect: 0,
      quizTotal: 0,
      mastered: false,
    });
    // Only the cohort deadline can ever open the lesson after it.
    expect(catalog.get(EMPTY_2)!.unlocked).toBe(false);
    expect(catalog.get(EMPTY_2)!.unlockedBy).toBeNull();
  });

  it('opens a lesson on the deadline but flags the student as behind', async () => {
    const catalog = await officeCatalog(lateStudentCookie);
    expect(catalog.get(MASTERY_2)!.unlocked).toBe(true);
    expect(catalog.get(MASTERY_2)!.unlockedBy).toBe('deadline');
    expect(catalog.get(MASTERY_2)!.behind).toBe(true);
    expect(catalog.get(MASTERY_1)!.mastery.mastered).toBe(false);
  });

  it('keeps the whole catalog unlocked for staff', async () => {
    const catalog = await officeCatalog(officeTeacherCookie, '?track=office');
    expect(catalog.size).toBeGreaterThanOrEqual(masteryLessonKeys.length);
    masteryLessonKeys.forEach((key) => {
      expect(catalog.get(key)!.unlocked).toBe(true);
      expect(catalog.get(key)!.unlockedBy).toBe('first');
      expect(catalog.get(key)!.behind).toBe(false);
    });
  });

  it('does not N+1: mastery for the whole catalog costs a fixed number of queries', async () => {
    const spies = {
      lesson: vi.spyOn(prisma.lesson, 'findMany'),
      assignment: vi.spyOn(prisma.assignment, 'findMany'),
      problem: vi.spyOn(prisma.problem, 'findMany'),
      quizQuestion: vi.spyOn(prisma.quizQuestion, 'findMany'),
      problemSubmission: vi.spyOn(prisma.problemSubmission, 'findMany'),
      quizAttempt: vi.spyOn(prisma.quizAttempt, 'findMany'),
    };
    try {
      await officeCatalog(officeStudentCookie);
      Object.entries(spies).forEach(([name, spy]) => {
        expect(spy, `${name}.findMany`).toHaveBeenCalledTimes(1);
      });
    } finally {
      Object.values(spies).forEach((spy) => spy.mockRestore());
    }
  });
});

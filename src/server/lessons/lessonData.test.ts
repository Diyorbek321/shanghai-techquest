import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { backendLessons } from '../../../prisma/lessonsData/backend';

const TOTAL_LESSONS = 96;
const LESSONS_PER_MONTH = 12;
const ASSET_DIR = path.join(process.cwd(), 'lesson-assets', 'backend');

describe('backend lesson catalog', () => {
  it('covers all 96 lessons with a gapless order', () => {
    expect(backendLessons).toHaveLength(TOTAL_LESSONS);
    expect(backendLessons.map((l) => l.order)).toEqual(
      Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1)
    );
  });

  it('derives month and week from the lesson order', () => {
    for (const lesson of backendLessons) {
      expect(lesson.month).toBe(Math.ceil(lesson.order / LESSONS_PER_MONTH));
      expect(lesson.week).toBe(Math.ceil(lesson.order / 3));
    }
  });

  it('gives every lesson real homework', () => {
    for (const lesson of backendLessons) {
      expect(lesson.homeworkMain.length, `dars ${lesson.order}`).toBeGreaterThan(0);
      expect(lesson.homeworkReview.length, `dars ${lesson.order}`).toBeGreaterThan(0);
      expect(lesson.homeworkReview.every((item) => item.trim().length > 0)).toBe(true);
    }
  });

  it('keeps homework to one main task plus a short review list', () => {
    // The decks are calibrated for ~30-45 minutes. A ballooning review list would
    // mean the parser swallowed unrelated blocks.
    for (const lesson of backendLessons) {
      expect(lesson.homeworkReview.length, `dars ${lesson.order}`).toBeLessThanOrEqual(5);
    }
  });

  it('extracts the five recap questions and three takeaways', () => {
    for (const lesson of backendLessons) {
      expect(lesson.quiz.length, `dars ${lesson.order}`).toBe(5);
      expect(lesson.objectives.length, `dars ${lesson.order}`).toBe(3);
    }
  });

  it('extracts all three MAKE tiers', () => {
    for (const lesson of backendLessons) {
      expect(lesson.makeEasy && lesson.makeMedium && lesson.makeHard, `dars ${lesson.order}`).toBeTruthy();
    }
  });

  it('marks every twelfth lesson as a project and rewards it more', () => {
    const projects = backendLessons.filter((l) => l.kind === 'project');
    expect(projects.map((l) => l.order)).toEqual([12, 24, 36, 48, 60, 72, 84, 96]);
    for (const project of projects) {
      const sibling = backendLessons.find((l) => l.month === project.month && l.kind === 'lesson')!;
      expect(project.xpReward).toBeGreaterThan(sibling.xpReward);
    }
  });

  it('uses unique keys', () => {
    expect(new Set(backendLessons.map((l) => l.key)).size).toBe(TOTAL_LESSONS);
  });

  it('ships a slide deck for every lesson', () => {
    for (const lesson of backendLessons) {
      expect(fs.existsSync(path.join(ASSET_DIR, lesson.slideFile)), lesson.slideFile).toBe(true);
    }
  });
});

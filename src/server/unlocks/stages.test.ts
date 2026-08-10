import { describe, expect, it } from 'vitest';
import { ALWAYS_OPEN, STAGES, unlockState } from './stages';

describe('unlockState', () => {
  // Gating the course behind progress in the course is circular, and a student
  // who cannot reach the lessons can never unlock anything.
  it('never locks the course, its practice or the student own pages', () => {
    const state = unlockState(0);
    for (const feature of ALWAYS_OPEN) expect(state.unlocked).toContain(feature);
    expect(state.locked.map((l) => l.feature)).not.toContain('backend_course');
    expect(state.locked.map((l) => l.feature)).not.toContain('problems');
  });

  it('opens a stage exactly at its threshold, not one lesson later', () => {
    const first = STAGES[0];
    expect(unlockState(first.requiredLessons - 1).unlocked).not.toContain(first.feature);
    expect(unlockState(first.requiredLessons).unlocked).toContain(first.feature);
  });

  it('reports how many lessons remain for each locked stage', () => {
    const state = unlockState(3);
    const leaderboard = state.locked.find((l) => l.feature === 'leaderboard');
    expect(leaderboard?.remaining).toBe(STAGES[0].requiredLessons - 3);
  });

  it('points at the nearest unlock, not an arbitrary one', () => {
    const state = unlockState(0);
    expect(state.next?.label).toBe(STAGES[0].label);
    expect(state.next?.remaining).toBe(STAGES[0].requiredLessons);
  });

  it('has nothing left to announce once everything is open', () => {
    const last = Math.max(...STAGES.map((s) => s.requiredLessons));
    const state = unlockState(last);
    expect(state.locked).toEqual([]);
    expect(state.next).toBeNull();
  });

  // A teacher needs every screen from the first day, and their own lesson count
  // is zero by definition.
  it('opens everything for staff', () => {
    const state = unlockState(0, true);
    for (const stage of STAGES) expect(state.unlocked).toContain(stage.feature);
    expect(state.locked).toEqual([]);
  });

  it('keeps thresholds in ascending order so `next` is really the nearest', () => {
    const thresholds = STAGES.map((s) => s.requiredLessons);
    expect([...thresholds].sort((a, b) => a - b)).toEqual(thresholds);
  });
});

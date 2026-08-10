import { describe, expect, it } from 'vitest';
import { LEAGUE_SIZE, leagueIndexFor, leagueName, leagueWindow } from './leagues';

const cohort = (n: number) => Array.from({ length: n }, (_, i) => `s${i}`);

describe('leagueName', () => {
  it('names the top tiers and numbers the rest', () => {
    expect(leagueName(0)).toBe('Olmos');
    expect(leagueName(3)).toBe('Bronza');
    expect(leagueName(4)).toBe('5-liga');
  });
});

describe('leagueIndexFor', () => {
  it('keeps a full league together', () => {
    expect(leagueIndexFor(0)).toBe(0);
    expect(leagueIndexFor(LEAGUE_SIZE - 1)).toBe(0);
    expect(leagueIndexFor(LEAGUE_SIZE)).toBe(1);
  });
});

describe('leagueWindow', () => {
  it('returns the slice containing the caller', () => {
    const ranked = cohort(120);
    const window = leagueWindow(ranked, 30);
    expect(window.index).toBe(1);
    expect(window.name).toBe('Oltin');
    expect(window.members).toHaveLength(LEAGUE_SIZE);
    expect(window.members[0]).toBe('s25');
    expect(window.members).toContain('s30');
  });

  // The whole point of leagues: someone last overall is mid-table locally, and
  // the number they see is small.
  it('never exposes a position from outside the caller league', () => {
    const ranked = cohort(400);
    const window = leagueWindow(ranked, 399);
    expect(window.members).toContain('s399');
    expect(window.members).not.toContain('s0');
    expect(window.members.indexOf('s399') + 1).toBeLessThanOrEqual(LEAGUE_SIZE);
  });

  it('gives a short final league its real length', () => {
    const ranked = cohort(30);
    const window = leagueWindow(ranked, 27);
    expect(window.index).toBe(1);
    expect(window.members).toHaveLength(5);
    expect(window.total).toBe(2);
  });

  // Staff have no student row, so findIndex returns -1.
  it('falls back to the top league for a caller outside the ranking', () => {
    const window = leagueWindow(cohort(60), -1);
    expect(window.index).toBe(0);
    expect(window.members[0]).toBe('s0');
  });

  it('reports at least one league for an empty cohort', () => {
    const window = leagueWindow([], -1);
    expect(window.members).toEqual([]);
    expect(window.total).toBe(1);
  });
});

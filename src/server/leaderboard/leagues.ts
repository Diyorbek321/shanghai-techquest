/**
 * Leaderboard leagues.
 *
 * A single ranked list is the one gamification element with direct evidence of
 * harm: in a longitudinal quasi-experiment leaderboards did not increase
 * practice and were followed by LOWER exam scores, and for students near the
 * bottom a public ranking reads as "you are incompetent" — it lowers their
 * sense of competence and cuts them off from the group rather than motivating
 * them. The fix that the same literature recommends is not to delete the board
 * but to bound it: rank students against a small band of near-equal peers, and
 * report personal progress alongside position.
 *
 * So a student never sees "#347 of 400". They see their position among ~25
 * students with adjacent scores, which is a race they can actually win.
 */

/** Small enough that the top of the board feels reachable, large enough to feel like a group. */
export const LEAGUE_SIZE = 25;

/**
 * Tier names, best first. Beyond the named tiers leagues are numbered, which is
 * deliberately flat: inventing ever-more-abject names for the lowest bands
 * would reintroduce exactly the status signal leagues exist to remove.
 */
const LEAGUE_NAMES = ['Olmos', 'Oltin', 'Kumush', 'Bronza'] as const;

export function leagueName(index: number): string {
  return LEAGUE_NAMES[index] ?? `${index + 1}-liga`;
}

/** Which league a 0-based position in the full ranking falls into. */
export function leagueIndexFor(position: number): number {
  return Math.floor(position / LEAGUE_SIZE);
}

export interface LeagueWindow<T> {
  members: T[];
  /** 0-based; 0 is the top league. */
  index: number;
  name: string;
  /** Total number of leagues in this scope, so the UI can say "2 / 6". */
  total: number;
}

/**
 * The slice of `ranked` containing `position`, plus the labels describing it.
 *
 * `position` of -1 means the caller is not in the ranking at all — staff have
 * no student row. They get the top league rather than an empty board, since for
 * a teacher the board is information about the class, not about themselves.
 */
export function leagueWindow<T>(ranked: readonly T[], position: number): LeagueWindow<T> {
  const total = Math.max(1, Math.ceil(ranked.length / LEAGUE_SIZE));
  const index = position >= 0 ? leagueIndexFor(position) : 0;
  const start = index * LEAGUE_SIZE;
  return {
    members: ranked.slice(start, start + LEAGUE_SIZE),
    index,
    name: leagueName(index),
    total,
  };
}

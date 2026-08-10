/**
 * Who may see a showcased project.
 *
 * Evidence for having a gallery at all: sharing work with a real audience is
 * what turned Scratch from a language into a community of 73 million accounts,
 * and the feedback students get there is overwhelmingly positive. Publication
 * is the part that makes a project feel like it was made for someone.
 *
 * But the authors here are schoolchildren, so the audience is bounded to the
 * people they already sit with: showcasing is opt-in, revocable, and reaches
 * their own track — never the open internet. The rules live here, apart from
 * the route, because "who can see a child's work" should be one readable
 * function with tests on it rather than a where-clause nobody re-reads.
 */

export interface ShowcaseCandidate {
  showcased: boolean;
  status: string;
  githubUrl: string | null;
  demoUrl: string | null;
  fileUrl: string | null;
}

/**
 * A submission belongs in the gallery only when the author asked for it AND
 * there is something to look at. A showcased row with no link and no file would
 * render as an empty card with a child's name on it.
 */
export function isGalleryEligible(submission: ShowcaseCandidate): boolean {
  if (!submission.showcased) return false;
  if (submission.status === 'PENDING') return false;
  return Boolean(submission.githubUrl || submission.demoUrl || submission.fileUrl);
}

export interface Viewer {
  role: string;
  track: string | null;
}

/**
 * Staff see every track; a student sees their own. A student with no track has
 * no cohort to belong to, so they see nothing rather than everything — the safe
 * direction for an account that is mid-setup.
 */
export function galleryTrackFilter(viewer: Viewer): { track: string } | 'all' | 'none' {
  if (viewer.role !== 'STUDENT') return 'all';
  return viewer.track ? { track: viewer.track } : 'none';
}

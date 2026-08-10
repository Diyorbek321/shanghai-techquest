import { describe, expect, it } from 'vitest';
import { galleryTrackFilter, isGalleryEligible, type ShowcaseCandidate } from './visibility';

const candidate = (over: Partial<ShowcaseCandidate> = {}): ShowcaseCandidate => ({
  showcased: true,
  status: 'SUBMITTED',
  githubUrl: 'https://github.com/x/y',
  demoUrl: null,
  fileUrl: null,
  ...over,
});

describe('isGalleryEligible', () => {
  // The whole safety property: nothing a child made is published unless they
  // asked for it.
  it('never includes work the author did not opt in to', () => {
    expect(isGalleryEligible(candidate({ showcased: false }))).toBe(false);
  });

  it('includes opted-in work that has something to look at', () => {
    expect(isGalleryEligible(candidate())).toBe(true);
    expect(isGalleryEligible(candidate({ githubUrl: null, demoUrl: 'https://demo.uz' }))).toBe(true);
    expect(isGalleryEligible(candidate({ githubUrl: null, fileUrl: '/api/uploads/a.zip' }))).toBe(true);
  });

  // Otherwise the gallery renders an empty card with a child's name on it.
  it('excludes opted-in work with no link and no file', () => {
    expect(isGalleryEligible(candidate({ githubUrl: null, demoUrl: null, fileUrl: null }))).toBe(false);
  });

  it('excludes work that has not been handed in yet', () => {
    expect(isGalleryEligible(candidate({ status: 'PENDING' }))).toBe(false);
  });
});

describe('galleryTrackFilter', () => {
  it('shows a student their own track only', () => {
    expect(galleryTrackFilter({ role: 'STUDENT', track: 'BACKEND' })).toEqual({ track: 'BACKEND' });
  });

  it('shows staff every track', () => {
    expect(galleryTrackFilter({ role: 'TEACHER', track: null })).toBe('all');
    expect(galleryTrackFilter({ role: 'ADMIN', track: null })).toBe('all');
  });

  // A half-configured student account must fail closed, not open.
  it('shows nothing to a student with no track', () => {
    expect(galleryTrackFilter({ role: 'STUDENT', track: null })).toBe('none');
  });
});

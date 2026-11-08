/**
 * A lesson's recorded video, given by the teacher as a Google Drive or
 * YouTube link.
 *
 * Only those two hosts are accepted, and the player URL is rebuilt here from
 * the file id alone — never echoed from the input — so a stored link can only
 * ever put a Drive or YouTube player in the page, whatever was pasted.
 */

export type VideoProvider = 'drive' | 'youtube';

export interface LessonVideo {
  readonly provider: VideoProvider;
  /** For the <iframe> in the lesson page. */
  readonly embedUrl: string;
  /** Opens the video on its own site, e.g. from the daily plan. */
  readonly watchUrl: string;
}

const DRIVE_ID = /^[A-Za-z0-9_-]{20,}$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function driveVideo(id: string): LessonVideo | null {
  if (!DRIVE_ID.test(id)) return null;
  return {
    provider: 'drive',
    embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    watchUrl: `https://drive.google.com/file/d/${id}/view`,
  };
}

function youtubeVideo(id: string): LessonVideo | null {
  if (!YOUTUBE_ID.test(id)) return null;
  return {
    provider: 'youtube',
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

/** The video a link points at, or null when it is not a Drive/YouTube video link. */
export function parseVideoLink(raw: string | null | undefined): LessonVideo | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'drive.google.com' || host === 'docs.google.com') {
    // /file/d/<id>/view, /file/d/<id>/preview, /open?id=<id>, /uc?id=<id>
    const fileIndex = segments.indexOf('d');
    if (segments[0] === 'file' && fileIndex === 1 && segments[2]) return driveVideo(segments[2]);
    const id = url.searchParams.get('id');
    if (id && (segments[0] === 'open' || segments[0] === 'uc')) return driveVideo(id);
    return null;
  }
  if (host === 'youtu.be') {
    return segments[0] ? youtubeVideo(segments[0]) : null;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (segments[0] === 'watch') {
      const id = url.searchParams.get('v');
      return id ? youtubeVideo(id) : null;
    }
    if ((segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'live') && segments[1]) {
      return youtubeVideo(segments[1]);
    }
  }
  return null;
}

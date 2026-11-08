import { describe, expect, it } from 'vitest';
import { parseVideoLink } from './video';

const DRIVE_ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';

describe('parseVideoLink', () => {
  it.each([
    `https://drive.google.com/file/d/${DRIVE_ID}/view?usp=sharing`,
    `https://drive.google.com/file/d/${DRIVE_ID}/preview`,
    `https://drive.google.com/open?id=${DRIVE_ID}`,
    `https://drive.google.com/uc?id=${DRIVE_ID}&export=download`,
  ])('accepts the Drive link %s', (link) => {
    expect(parseVideoLink(link)).toEqual({
      provider: 'drive',
      embedUrl: `https://drive.google.com/file/d/${DRIVE_ID}/preview`,
      watchUrl: `https://drive.google.com/file/d/${DRIVE_ID}/view`,
    });
  });

  it.each([
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://youtube.com/shorts/dQw4w9WgXcQ',
  ])('accepts the YouTube link %s', (link) => {
    expect(parseVideoLink(link)?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it.each([
    '',
    'not a url',
    'javascript:alert(1)',
    'https://evil.example/file/d/' + DRIVE_ID + '/view',
    'https://drive.google.com.evil.example/file/d/' + DRIVE_ID + '/view',
    'https://drive.google.com/drive/folders/' + DRIVE_ID,
    'https://drive.google.com/file/d/short/view',
    'https://www.youtube.com/watch?v=bad"id<>',
    'https://www.youtube.com/channel/UC123',
  ])('rejects %s', (link) => {
    expect(parseVideoLink(link)).toBeNull();
  });

  it('builds the player URL from the id alone, never from the input', () => {
    const video = parseVideoLink(`https://drive.google.com/file/d/${DRIVE_ID}/view?x="><script>`);
    expect(video?.embedUrl).toBe(`https://drive.google.com/file/d/${DRIVE_ID}/preview`);
  });
});

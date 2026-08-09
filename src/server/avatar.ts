import { createHash } from 'crypto';

/**
 * Avatar URLs are rendered by a third party (dicebear) and are exposed on the
 * public portfolio endpoint, so the seed must not be personal data: seeding it
 * with the raw email both leaked the address to anyone who could read a
 * profile and shipped it to dicebear on every avatar render.
 *
 * A truncated SHA-256 of the lowercased email keeps avatars stable and unique
 * per account while being useless to anyone who reads the URL.
 */
export function avatarUrlForEmail(email: string): string {
  const seed = createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 16);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

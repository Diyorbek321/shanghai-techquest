import { randomInt } from 'crypto';

/**
 * Students are enrolled by their teacher and often have no email address of
 * their own, so their login is generated from their name on a domain that is
 * deliberately not routable. Nothing is ever sent to it — it is only the
 * identifier they type on the sign-in screen.
 */
export const STUDENT_LOGIN_DOMAIN = 'techquest.local';

const FALLBACK_SLUG = 'oquvchi';

/**
 * Uzbek Latin writes o' / g' with several different quote characters depending
 * on the keyboard, and registers are still sometimes kept in Cyrillic. Both are
 * folded down to plain ASCII so the generated login stays typeable.
 */
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

/** Every quote-ish character that shows up in o' / g' across keyboards. */
const APOSTROPHES = /['‘’ʻʼ`´]/g;

/**
 * "Nodira Karimova" -> "nodira.karimova".
 *
 * Apostrophes are dropped rather than replaced, so G'aniyev becomes ganiyev —
 * replacing them with a separator would produce g.aniyev and split the surname.
 */
export function loginSlug(name: string): string {
  const parts = name
    .toLowerCase()
    .replace(APOSTROPHES, '')
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('')
    // Strip accents that survive from Latin-1 spellings.
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/\s+/)
    .map((part) => part.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  return parts.length > 0 ? parts.join('.') : FALLBACK_SLUG;
}

/**
 * A login for `name` that is not already in `taken`. The caller passes the
 * addresses it has just handed out as well as the ones in the database, so a
 * batch of same-named students in one request cannot collide with each other.
 */
export function buildLogin(name: string, taken: Set<string>): string {
  const slug = loginSlug(name);
  const first = `${slug}@${STUDENT_LOGIN_DOMAIN}`;
  if (!taken.has(first)) return first;

  // Starts at 2 so the second Ali Valiyev reads ali.valiyev2, not ali.valiyev1.
  for (let n = 2; ; n += 1) {
    const candidate = `${slug}${n}@${STUDENT_LOGIN_DOMAIN}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/**
 * Passwords are read off a screen and typed by a child, so the alphabet omits
 * the characters that are routinely confused: 0/O, 1/l/I. 10 characters from
 * this 57-symbol alphabet is ~58 bits, well beyond what a shared classroom
 * credential needs, and still short enough to copy by hand.
 */
const PASSWORD_ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PASSWORD_LENGTH = 10;

export function generatePassword(length: number = PASSWORD_LENGTH): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  }
  return out;
}

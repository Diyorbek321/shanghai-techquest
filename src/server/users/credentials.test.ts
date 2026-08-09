import { describe, expect, it } from 'vitest';
import { STUDENT_LOGIN_DOMAIN, buildLogin, generatePassword, loginSlug } from './credentials';

describe('loginSlug', () => {
  it('lowercases and joins name parts with a dot', () => {
    expect(loginSlug('Nodira Karimova')).toBe('nodira.karimova');
  });

  it("strips the apostrophes in Uzbek o' and g'", () => {
    // Otabek G'aniyev must not become "otabek.g-aniyev" or keep a quote that
    // would be illegal in the local part of an address.
    expect(loginSlug("Otabek G'aniyev")).toBe('otabek.ganiyev');
    expect(loginSlug('Gʻulom Oʻktamov')).toBe('gulom.oktamov');
  });

  it('transliterates Cyrillic, since registers are sometimes kept in it', () => {
    expect(loginSlug('Нодира Каримова')).toBe('nodira.karimova');
  });

  it('collapses extra whitespace and drops punctuation', () => {
    expect(loginSlug('  Ali   Vali-ogli  ')).toBe('ali.valiogli');
  });

  it('falls back to a placeholder when nothing usable survives', () => {
    // A name written entirely in an unsupported script would otherwise produce
    // an empty local part and an invalid address.
    expect(loginSlug('???')).toBe('oquvchi');
    expect(loginSlug('')).toBe('oquvchi');
  });
});

describe('buildLogin', () => {
  it('builds an address on the student login domain', () => {
    expect(buildLogin('Nodira Karimova', new Set())).toBe(`nodira.karimova@${STUDENT_LOGIN_DOMAIN}`);
  });

  it('appends a counter when the address is taken', () => {
    const taken = new Set([`nodira.karimova@${STUDENT_LOGIN_DOMAIN}`]);
    expect(buildLogin('Nodira Karimova', taken)).toBe(`nodira.karimova2@${STUDENT_LOGIN_DOMAIN}`);
  });

  it('keeps counting past the first collision', () => {
    const taken = new Set([
      `ali.valiyev@${STUDENT_LOGIN_DOMAIN}`,
      `ali.valiyev2@${STUDENT_LOGIN_DOMAIN}`,
      `ali.valiyev3@${STUDENT_LOGIN_DOMAIN}`,
    ]);
    expect(buildLogin('Ali Valiyev', taken)).toBe(`ali.valiyev4@${STUDENT_LOGIN_DOMAIN}`);
  });
});

describe('generatePassword', () => {
  it('is long enough to satisfy the account password rule', () => {
    // createUserSchema requires min(8); a shorter generated password would make
    // teacher-created accounts fail validation.
    expect(generatePassword().length).toBeGreaterThanOrEqual(8);
  });

  it('avoids characters that are misread when copied off a screen', () => {
    for (let i = 0; i < 200; i += 1) {
      expect(generatePassword()).not.toMatch(/[0O1lI]/);
    }
  });

  it('does not repeat', () => {
    const seen = new Set(Array.from({ length: 200 }, () => generatePassword()));
    expect(seen.size).toBe(200);
  });
});

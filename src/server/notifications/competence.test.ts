import { describe, expect, it } from 'vitest';
import { competenceMessage } from './competence';

describe('competenceMessage', () => {
  it('leads with what the student did, not with the payment', () => {
    const body = competenceMessage('Fibonacci', 25, { topic: 'rekursiya', solved: 4, available: 12 });

    expect(body.indexOf('barcha testlar')).toBeLessThan(body.indexOf('+25 XP'));
    expect(body).toContain('rekursiya: 4/12 masala yechildi.');
  });

  it('marks a topic finished only when every problem in it is solved', () => {
    expect(competenceMessage('X', 10, { topic: 'sikllar', solved: 6, available: 6 })).toContain(
      "Bu mavzuni to'liq yopdingiz."
    );
    expect(competenceMessage('X', 10, { topic: 'sikllar', solved: 5, available: 6 })).not.toContain(
      "to'liq yopdingiz"
    );
  });

  it('omits the topic line when the problem carries no usable tag', () => {
    const body = competenceMessage('X', 10, { topic: null, solved: 0, available: 0 });
    expect(body).toBe('"X" — barcha testlar o\'tdi. +10 XP.');
  });

  // A re-solve awards nothing; the message must not then advertise "+0 XP".
  it('drops the reward clause when nothing was awarded', () => {
    const body = competenceMessage('X', 0, { topic: 'satrlar', solved: 2, available: 9 });
    expect(body).not.toContain('XP');
    expect(body).toContain('satrlar: 2/9');
  });

  // Defensive: a tag set that exists but has no counted problems must not
  // produce "0/0", which reads as a bug to the student.
  it('omits the topic line when no problems carry the tag', () => {
    const body = competenceMessage('X', 5, { topic: 'yangi', solved: 0, available: 0 });
    expect(body).not.toContain('0/0');
  });
});

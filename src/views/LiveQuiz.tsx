import React from 'react';
import { User } from '../types';
import { LiveHost } from '../components/live/LiveHost';
import { LivePlayer } from '../components/live/LivePlayer';

/** Kahoot-style live quiz: staff host on the projector, students play from their phones. */
export function LiveQuiz({ user }: { user: User }) {
  return user.role === 'student' ? <LivePlayer userId={user.id} /> : <LiveHost />;
}

import { Track, ViewType } from '../types';

/** Display name for each track. Mirrors TRACK_VALUES in src/server/serializers/track.ts. */
export const TRACK_LABEL: Record<Track, string> = {
  frontend: 'Frontend',
  robotics: 'Robototexnika',
  office: 'Ofis',
  backend: 'Python Backend',
};

/** Falls back to the raw value so an unknown track never renders as "undefined". */
export function trackLabel(track: string | null | undefined): string {
  if (!track) return '—';
  return TRACK_LABEL[track as Track] ?? track;
}

export const TRACK_BADGE: Record<Track, string> = {
  frontend: 'bg-brand-cyan/20 text-brand-cyan',
  robotics: 'bg-brand-purple/20 text-brand-purple',
  office: 'bg-blue-500/20 text-blue-400',
  backend: 'bg-emerald-500/20 text-emerald-400',
};

export const TRACK_STYLE: Record<Track, { bg: string; text: string; badge: string; view: ViewType }> = {
  frontend: {
    bg: 'bg-brand-cyan/10',
    text: 'text-brand-cyan',
    badge: 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30',
    view: 'frontend_course',
  },
  robotics: {
    bg: 'bg-brand-purple/10',
    text: 'text-brand-purple',
    badge: 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30',
    view: 'robotics_lab',
  },
  office: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    badge: 'bg-blue-500/20 text-blue-500 border border-blue-500/30',
    view: 'office_course',
  },
  backend: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    view: 'backend_course',
  },
};

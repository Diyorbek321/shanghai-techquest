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

/**
 * Profile blurb per track. This used to be one hardcoded paragraph describing a
 * frontend developer, printed on every student's profile whatever they studied.
 */
export const TRACK_BIO: Record<Track, string> = {
  frontend:
    "Dizayn va kod chorrahasini o'rganayotgan ishtiyoqli frontend dasturchi. HTML, CSS va JavaScript'ni egallab, interfeyslarni jonlantirmoqda.",
  robotics:
    "Sxema va kodni birlashtirayotgan robototexnika kursanti. Arduino, sensorlar va harakat mexanizmlari ustida ishlamoqda.",
  office:
    "Ma'lumotni tartibga solishni o'rganayotgan ofis dasturlari tahlilchisi. Word, Excel va PowerPoint vositalarini chuqur egallamoqda.",
  backend:
    "Server tomonini quruvchi Python backend dasturchi. Ma'lumotlar bazasi, SQL, Django va API'lar ustida ishlamoqda.",
};

export function trackBio(track: Track | null | undefined): string {
  if (!track) return "Yo'nalish tanlanmagan. Kursni boshlash uchun Mening Sinflarim bo'limiga o'ting.";
  return TRACK_BIO[track];
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

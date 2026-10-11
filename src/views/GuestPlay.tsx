import React from 'react';
import { Code } from 'lucide-react';
import { LivePlayer } from '../components/live/LivePlayer';

/** Public /play page: anyone with a PIN joins the live quiz under a name, no account needed. */
export function GuestPlay() {
  return (
    <div className="h-screen w-full overflow-y-auto bg-brand-bg px-4 py-6 text-white">
      <header className="mx-auto mb-6 flex max-w-xl items-center justify-between">
        <span className="flex items-center gap-2 font-heading font-bold tracking-wider text-brand-cyan">
          <Code size={22} /> TechQuest
        </span>
        <a href="/" className="text-sm text-gray-400 hover:text-white">
          Hisobingiz bormi? <span className="font-semibold text-brand-cyan">Kirish</span>
        </a>
      </header>
      <LivePlayer guest />
    </div>
  );
}

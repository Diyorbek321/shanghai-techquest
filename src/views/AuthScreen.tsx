import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Loader2, Cpu, Presentation } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Track } from '../types';
import { ApiError } from '../lib/api';

const TRACK_OPTIONS: { id: Track; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'frontend', label: 'Frontend Dasturlash', desc: 'HTML, CSS, JS va React', icon: <Code size={20} /> },
  { id: 'robotics', label: 'Robototexnika', desc: 'Arduino va apparat qismlar', icon: <Cpu size={20} /> },
  { id: 'office', label: 'Ofis Dasturlari', desc: 'Word, Excel, PowerPoint', icon: <Presentation size={20} /> },
];

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [track, setTrack] = useState<Track>('frontend');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name, track);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-bg text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1E2248_0%,_#0A0E27_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-panel p-8 mx-4"
      >
        <div className="flex items-center gap-3 text-brand-cyan mb-8">
          <div className="p-1.5 bg-brand-cyan/10 rounded-lg">
            <Code size={24} className="text-brand-cyan" />
          </div>
          <span className="font-heading font-bold text-lg tracking-wider text-glow">TechQuest</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">{mode === 'login' ? 'Xush kelibsiz' : 'Hisob yarating'}</h1>
        <p className="text-gray-400 text-sm mb-6">
          {mode === 'login' ? "Missiyangizni davom ettirish uchun kiring." : "Yo'nalishingizni tanlang va sayohatni boshlang."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ism</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-brand-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="Aziz Karimov"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-brand-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              placeholder="siz@misol.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Parol</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-brand-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yo'nalishingizni tanlang</label>
              <div className="grid grid-cols-1 gap-2">
                {TRACK_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setTrack(opt.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                      track === opt.id
                        ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                        : 'border-brand-border text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {opt.icon}
                    <div>
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-cyan hover:bg-brand-cyan/80 disabled:opacity-60 text-black font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Kirish' : 'Hisob yaratish'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
          className="w-full text-center text-sm text-gray-400 hover:text-white mt-6 transition-colors"
        >
          {mode === 'login' ? "Hisobingiz yo'qmi? " : 'Hisobingiz bormi? '}
          <span className="text-brand-cyan font-semibold">{mode === 'login' ? "Ro'yxatdan o'tish" : 'Kirish'}</span>
        </button>
      </motion.div>
    </div>
  );
}

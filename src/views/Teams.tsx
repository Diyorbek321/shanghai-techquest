import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Zap,
  Search,
  Plus,
  ChevronRight,
  Star,
  Swords,
  LogOut,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { User } from '../types';

interface Team {
  id: string;
  name: string;
  motto: string | null;
  tag: string;
  color: string;
  memberCount: number;
  isMine: boolean;
}

const DEFAULT_TEAM_COLOR = '#00D9FF';

export function Teams({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formMotto, setFormMotto] = useState('');
  const [formColor, setFormColor] = useState(DEFAULT_TEAM_COLOR);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<Team[]>('/teams'),
  });

  const invalidateAfterMutation = () => {
    queryClient.invalidateQueries({ queryKey: ['teams'] });
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const createMutation = useMutation({
    mutationFn: (input: { name: string; motto?: string; tag: string; color: string }) =>
      api.post<Team>('/teams', input),
    onSuccess: () => {
      invalidateAfterMutation();
      setShowCreateForm(false);
      setFormName('');
      setFormTag('');
      setFormMotto('');
      setFormColor(DEFAULT_TEAM_COLOR);
    },
  });

  const joinMutation = useMutation({
    mutationFn: (teamId: string) => api.post<void>(`/teams/${teamId}/join`),
    onSuccess: invalidateAfterMutation,
  });

  const leaveMutation = useMutation({
    mutationFn: () => api.post<void>('/teams/leave'),
    onSuccess: invalidateAfterMutation,
  });

  const handleCreate = async () => {
    if (!formName.trim() || !formTag.trim()) {
      alert("Jamoa nomi va tegini kiriting.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        motto: formMotto.trim() || undefined,
        tag: formTag.trim().toUpperCase(),
        color: formColor,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        throw err;
      }
    }
  };

  const handleJoin = async (teamId: string) => {
    try {
      await joinMutation.mutateAsync(teamId);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        throw err;
      }
    }
  };

  const handleLeave = async () => {
    if (!confirm("Jamoadan chiqishni tasdiqlaysizmi?")) return;
    try {
      await leaveMutation.mutateAsync();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        throw err;
      }
    }
  };

  const filteredTeams = teams.filter((team) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return team.name.toLowerCase().includes(q) || team.tag.toLowerCase().includes(q) || (team.motto ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tighter flex items-center gap-4">
            Jamoalar va Fraksiyalar
          </h1>
          <p className="text-gray-400 mt-2">Guruh missiyalarini bajarish va mavsumiy reytingda hukmronlik qilish uchun zabardast jamoaga qo'shiling.</p>
        </div>
        <div className="flex gap-3">
          {user.teamId ? (
            <button
              onClick={handleLeave}
              disabled={leaveMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <LogOut size={20} />
              Jamoadan chiqish
            </button>
          ) : (
            <button
              onClick={() => setShowCreateForm((v) => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-cyan hover:bg-brand-cyan/80 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)]"
            >
              {showCreateForm ? <X size={20} /> : <Plus size={20} />}
              {showCreateForm ? 'Bekor qilish' : 'Jamoa tuzish'}
            </button>
          )}
        </div>
      </div>

      {showCreateForm && !user.teamId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 border border-brand-cyan/30 rounded-2xl mb-8 space-y-4"
        >
          <h3 className="text-white font-bold">Yangi jamoa yaratish</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Jamoa nomi"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              maxLength={100}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-brand-cyan focus:outline-none md:col-span-2"
            />
            <input
              type="text"
              placeholder="Teg (masalan: SEC)"
              value={formTag}
              onChange={(e) => setFormTag(e.target.value)}
              maxLength={6}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-brand-cyan focus:outline-none uppercase"
            />
            <input
              type="color"
              value={formColor}
              onChange={(e) => setFormColor(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl h-full w-full cursor-pointer"
            />
          </div>
          <input
            type="text"
            placeholder="Shior (ixtiyoriy)"
            value={formMotto}
            onChange={(e) => setFormMotto(e.target.value)}
            maxLength={200}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-brand-cyan focus:outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-brand-cyan hover:bg-brand-cyan/80 disabled:opacity-50 text-black font-bold rounded-xl transition-all text-sm"
          >
            Yaratish
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Jamoalarni nomi, teg yoki g'oyasi bo'yicha qidiring..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm focus:border-brand-cyan focus:outline-none transition-all"
              />
            </div>
          </div>

          {isLoading && <p className="text-sm text-gray-500">Jamoalar yuklanmoqda...</p>}
          {!isLoading && filteredTeams.length === 0 && (
            <p className="text-sm text-gray-500">Hech qanday jamoa topilmadi.</p>
          )}

          <div className="space-y-4">
            {filteredTeams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-all group"
                style={{ boxShadow: `0 0 15px ${team.color}4D` }}
              >
                <div className="flex items-center gap-6">
                  <div
                    className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl font-heading font-black"
                    style={{ color: team.color }}
                  >
                    {team.tag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">{team.name}</h3>
                      {team.isMine && (
                        <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30 uppercase tracking-widest">Sizning jamoangiz</span>
                      )}
                    </div>
                    {team.motto && <p className="text-sm text-gray-400 italic mb-4 line-clamp-1">"{team.motto}"</p>}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={14} className="text-brand-cyan" />
                        <span className="text-gray-300 font-bold">{team.memberCount}</span> A'zo
                      </div>
                    </div>
                  </div>
                  {team.isMine ? (
                    <ChevronRight size={24} className="text-gray-600 group-hover:text-brand-cyan transition-colors" />
                  ) : !user.teamId ? (
                    <button
                      onClick={() => handleJoin(team.id)}
                      disabled={joinMutation.isPending}
                      className="px-4 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-bold rounded-lg border border-brand-cyan/30 transition-all disabled:opacity-50 shrink-0"
                    >
                      Qo'shilish
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-brand-cyan/5">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Star size={20} className="text-brand-cyan" />
              Mavsumiy Missiyalar
            </h2>
            <p className="text-xs text-gray-500">Bu funksiya hali ishlab chiqilmoqda &mdash; tez orada jamoaviy missiyalar qo'shiladi.</p>
          </div>

          <div className="glass-panel p-6 border border-white/10 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Swords size={20} className="text-brand-red" />
              Fraksiyalar Jangi
            </h2>
            <p className="text-xs text-gray-500">Fraksiyalar o'rtasidagi jang tizimi hali mavjud emas &mdash; tez orada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

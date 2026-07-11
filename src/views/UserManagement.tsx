import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Shield, Search } from 'lucide-react';
import { UserRole, Track } from '../types';
import { api, ApiError } from '../lib/api';

interface DirectoryUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  track: Track | null;
  createdAt: string;
  lastSeenAt: string | null;
}

const ROLE_LABEL: Record<UserRole, string> = {
  student: "O'quvchi",
  teacher: "O'qituvchi",
  admin: 'Admin',
};

const ROLE_BADGE: Record<UserRole, string> = {
  student: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  teacher: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
  admin: 'bg-brand-purple/20 text-brand-purple border-brand-purple/30',
};

const TRACK_LABEL: Record<Track, string> = {
  frontend: 'Frontend',
  robotics: 'Robototexnika',
  office: 'Ofis',
};

export function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<DirectoryUser[]>('/users'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const visibleUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (user: DirectoryUser) => {
    if (window.confirm(`${user.name} (${user.email}) hisobini o'chirishni tasdiqlaysizmi?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-1">Foydalanuvchilar</h1>
          <p className="text-gray-400">O'qituvchi, admin va o'quvchi hisoblarini boshqaring.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <UserPlus size={16} /> Yangi foydalanuvchi
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism yoki email bo'yicha qidirish..."
          className="w-full bg-black/30 border border-brand-border rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-brand-cyan"
        />
      </div>

      <div className="glass-panel border border-brand-border rounded-2xl overflow-hidden">
        {isLoading && <p className="text-sm text-gray-500 p-6">Yuklanmoqda...</p>}
        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 font-bold">Ism</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Rol</th>
                  <th className="px-6 py-4 font-bold">Yo'nalish</th>
                  <th className="px-6 py-4 font-bold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-white">{u.name}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${ROLE_BADGE[u.role]}`}>
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{u.track ? TRACK_LABEL[u.track] : '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={deleteMutation.isPending}
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-brand-red transition-colors disabled:opacity-50"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      Hech kim topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateUserModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

function CreateUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [track, setTrack] = useState<Track | ''>('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      api.post('/users', {
        email,
        password,
        name,
        role,
        track: track || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEmail('');
      setPassword('');
      setName('');
      setRole('teacher');
      setTrack('');
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Xatolik yuz berdi.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createMutation.mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-purple/10 rounded-lg border border-brand-purple/20">
                  <Shield size={20} className="text-brand-purple" />
                </div>
                <h2 className="text-xl font-heading font-bold text-white">Yangi foydalanuvchi</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white p-2">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">To'liq ism</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Parol (kamida 8 belgi)</label>
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rol</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="teacher" className="bg-brand-bg">O'qituvchi</option>
                    <option value="admin" className="bg-brand-bg">Admin</option>
                    <option value="student" className="bg-brand-bg">O'quvchi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Yo'nalish {role === 'student' ? '' : '(ixtiyoriy)'}</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as Track | '')}
                    required={role === 'student'}
                    className="w-full bg-black/30 border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="" className="bg-brand-bg">—</option>
                    <option value="frontend" className="bg-brand-bg">Frontend</option>
                    <option value="robotics" className="bg-brand-bg">Robototexnika</option>
                    <option value="office" className="bg-brand-bg">Ofis</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-brand-red">{error}</p>}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/50 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Yaratilmoqda...' : 'Hisob yaratish'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

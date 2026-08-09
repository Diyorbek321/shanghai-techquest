import React, { useState } from 'react';
import { Check, Copy, KeyRound, Loader2, UserPlus, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

/**
 * Credentials as returned by the server. The password is present only in the
 * response that created or reset it — it is never stored in the clear and can
 * never be read back, so the teacher has to hand it over before leaving the
 * screen. That is why issued credentials stay pinned in the panel until
 * dismissed rather than disappearing on the next refetch.
 */
interface IssuedCredential {
  id: string;
  name: string;
  login: string;
  password: string;
}

interface StudentRow {
  id: string;
  name: string;
}

interface Props {
  classId: string | null;
  className?: string;
}

export function StudentAccountsPanel({ classId }: Props) {
  const [names, setNames] = useState('');
  const [issued, setIssued] = useState<IssuedCredential[]>([]);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ['classes', classId, 'students'],
    queryFn: () => api.get<StudentRow[]>(`/classes/${classId}/students`),
    enabled: !!classId,
  });

  const parsedNames = names
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const createStudents = useMutation({
    mutationFn: () => api.post<{ created: IssuedCredential[] }>(`/classes/${classId}/students`, { names: parsedNames }),
    onSuccess: (data) => {
      setIssued((prev) => [...data.created, ...prev]);
      setNames('');
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const resetPassword = useMutation({
    mutationFn: (studentId: string) => api.post<IssuedCredential>(`/users/${studentId}/reset-password`),
    onSuccess: (data) => {
      setIssued((prev) => [data, ...prev.filter((c) => c.id !== data.id)]);
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  if (!classId) {
    return <p className="text-sm text-gray-500">Avval sinf tanlang.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Create accounts */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <UserPlus size={16} className="text-brand-cyan" /> Yangi o'quvchi hisoblari
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Har bir qatorga bitta ism-familiya yozing. Login va parol avtomatik yaratiladi.
        </p>
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          rows={5}
          placeholder={'Nodira Karimova\nOtabek G\'aniyev\nAli Valiyev'}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white font-mono focus:outline-none focus:border-brand-cyan transition-all"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 font-mono">
            {parsedNames.length > 0 ? `${parsedNames.length} ta o'quvchi tayyor` : 'Ism kiritilmagan'}
          </span>
          <button
            type="button"
            disabled={parsedNames.length === 0 || createStudents.isPending}
            onClick={() => createStudents.mutate()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-cyan text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            {createStudents.isPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
            Hisob yaratish
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-brand-red">{error}</p>}
      </div>

      {issued.length > 0 && <IssuedCredentialsCard credentials={issued} onDismiss={() => setIssued([])} />}

      {/* Existing roster with reset */}
      <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest p-6 pb-4 flex items-center gap-2">
          <Users size={16} className="text-brand-purple" /> Sinf ro'yxati ({students.length})
        </h3>
        <div className="divide-y divide-white/5">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between px-6 py-3">
              <span className="text-sm text-white">{student.name}</span>
              <button
                type="button"
                disabled={resetPassword.isPending}
                onClick={() => resetPassword.mutate(student.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-all"
              >
                <KeyRound size={12} /> Parolni tiklash
              </button>
            </div>
          ))}
          {students.length === 0 && <p className="px-6 py-4 text-sm text-gray-500">Bu sinfda hali o'quvchi yo'q.</p>}
        </div>
      </div>
    </div>
  );
}

function IssuedCredentialsCard({ credentials, onDismiss }: { credentials: IssuedCredential[]; onDismiss: () => void }) {
  const asText = credentials.map((c) => `${c.name}\t${c.login}\t${c.password}`).join('\n');

  return (
    <div className="glass-panel p-6 border border-brand-orange/30 rounded-2xl bg-brand-orange/5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
            <KeyRound size={16} /> Login va parollar
          </h3>
          {/* The plaintext exists only here: it is hashed on the server and this
              screen is the single chance to copy it. */}
          <p className="text-xs text-gray-400 mt-1">
            Bu parollar faqat hozir ko'rinadi — nusxalab, o'quvchilarga bering. Keyin faqat tiklash mumkin.
          </p>
        </div>
        <CopyButton text={asText} label="Hammasini nusxalash" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              <th className="py-2 pr-4 font-bold">Ism</th>
              <th className="py-2 pr-4 font-bold">Login</th>
              <th className="py-2 pr-4 font-bold">Parol</th>
              <th className="py-2 font-bold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {credentials.map((c) => (
              <tr key={c.id}>
                <td className="py-2 pr-4 text-sm text-white">{c.name}</td>
                <td className="py-2 pr-4 text-xs text-gray-300 font-mono">{c.login}</td>
                <td className="py-2 pr-4 text-xs text-brand-orange font-mono font-bold">{c.password}</td>
                <td className="py-2">
                  <CopyButton text={`${c.login}  ${c.password}`} label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onDismiss} className="mt-4 text-[10px] text-gray-500 hover:text-white uppercase tracking-wider">
        Yopish (nusxalab bo'ldim)
      </button>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard is unavailable outside a secure context; the values stay
      // visible on screen, so failing to copy must not break the panel.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 transition-all whitespace-nowrap"
    >
      {copied ? <Check size={12} className="text-brand-green" /> : <Copy size={12} />}
      {label}
    </button>
  );
}

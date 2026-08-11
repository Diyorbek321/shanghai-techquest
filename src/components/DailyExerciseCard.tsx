import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Code, Flame, CheckCircle2 } from 'lucide-react';
import { Track, ViewType } from '../types';
import { api, ApiError } from '../lib/api';
import { TRACK_STYLE } from '../lib/tracks';

interface DailyExercise {
  id: string;
  prompt: string;
  estMinutes: number;
  xpReward: number;
  completed: boolean;
  streak: number;
}

interface DailyExerciseCardProps {
  track: Track | null;
  onNavigate: (view: ViewType) => void;
}

/**
 * Today's drill, taken from the track-aware /daily-exercise pool.
 *
 * This card used to be two hardcoded frontend katas ("Divni markazga
 * joylashtirish"), shown to every student regardless of what they study — a
 * backend cohort was being offered CSS. The real exercises have existed per
 * track all along; the dashboard just was not reading them.
 *
 * Office keeps its own richer flow in OfficeCourse, where the drill is finished
 * by uploading a file, so that track is sent there rather than being given a
 * one-click completion that would skip the upload.
 */
export function DailyExerciseCard({ track, onNavigate }: DailyExerciseCardProps) {
  const queryClient = useQueryClient();
  const uploadsFile = track === 'office';

  const { data: exercise } = useQuery({
    queryKey: ['daily-exercise'],
    // 404 = no exercise seeded for this track yet, 400 = account has no track.
    // Both mean "nothing to show", not an error worth surfacing here.
    queryFn: async (): Promise<DailyExercise | null> => {
      try {
        return await api.get<DailyExercise>('/daily-exercise');
      } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
        throw err;
      }
    },
  });

  const complete = useMutation({
    mutationFn: () => api.post<{ xp: number; streak: number }>('/daily-exercise/complete', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-exercise'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  if (!exercise) return null;

  return (
    <section className="glass-panel p-5 relative overflow-hidden group border-brand-orange/30">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Code className="text-brand-orange" size={18} />
          <h2 className="font-semibold text-lg text-glow text-brand-orange">Kunlik mashq</h2>
        </div>
        {exercise.streak > 0 && (
          <span className="text-xs font-mono bg-brand-orange/20 text-brand-orange px-2 py-1 rounded flex items-center gap-1">
            <Flame size={12} /> {exercise.streak} kun
          </span>
        )}
      </div>

      <div className="bg-black/30 border border-brand-orange/20 rounded-lg p-4">
        <p className="text-sm text-gray-200 mb-4 whitespace-pre-line">{exercise.prompt}</p>

        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={10} /> Taxminan {exercise.estMinutes} daqiqa
            </span>
            <span className="text-[#FFD700] font-bold">+{exercise.xpReward} XP</span>
          </div>

          {exercise.completed ? (
            <span className="text-xs text-brand-green font-bold flex items-center gap-1">
              <CheckCircle2 size={14} /> Bugun bajarildi
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(uploadsFile && track ? TRACK_STYLE[track].view : 'codelab')}
                className="text-xs border border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10 font-bold px-3 py-1.5 rounded transition-colors"
              >
                {uploadsFile ? 'Mashqqa o\'tish' : 'Kod yozish'}
              </button>
              {!uploadsFile && (
                <button
                  onClick={() => complete.mutate()}
                  disabled={complete.isPending}
                  className="text-xs bg-brand-orange hover:bg-brand-orange/80 text-black font-bold px-3 py-1.5 rounded disabled:opacity-50"
                >
                  {complete.isPending ? 'Saqlanmoqda...' : 'Bajardim'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

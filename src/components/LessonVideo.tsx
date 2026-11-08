import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Video } from 'lucide-react';
import { api, ApiError } from '../lib/api';

export interface LessonVideoData {
  provider: 'drive' | 'youtube';
  embedUrl: string;
  watchUrl: string;
}

interface LessonVideoProps {
  lessonKey: string;
  video: LessonVideoData | null;
  /** Teachers and admins can attach or replace the link. */
  canEdit: boolean;
}

/**
 * The lesson's recorded video, played in place. The player URL comes from the
 * server, which only ever builds Drive or YouTube player addresses.
 */
export function LessonVideo({ lessonKey, video, canEdit }: LessonVideoProps) {
  const queryClient = useQueryClient();
  const [link, setLink] = useState('');
  const [editing, setEditing] = useState(false);

  const save = useMutation({
    mutationFn: (url: string | null) => api.put<{ video: LessonVideoData | null }>(`/lessons/${lessonKey}/video`, { url }),
    onSuccess: () => {
      setLink('');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonKey] });
      queryClient.invalidateQueries({ queryKey: ['daily-plan'] });
    },
  });
  const error = save.error instanceof ApiError ? save.error.message : save.error ? "Saqlab bo'lmadi." : null;

  if (!video && !canEdit) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
        <Video size={16} className="text-emerald-400" /> Video dars
      </h3>

      {video && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-brand-border bg-black">
          <iframe
            src={video.embedUrl}
            title="Video dars"
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      {canEdit && (editing || !video) && (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (link.trim()) save.mutate(link.trim());
          }}
        >
          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Google Drive yoki YouTube havolasi"
              className="flex-1 min-w-0 bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-sm text-white"
            />
            <button
              type="submit"
              disabled={save.isPending || !link.trim()}
              className="px-3 py-2 text-sm rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 disabled:opacity-50"
            >
              {save.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Saqlash'}
            </button>
          </div>
          <p className="text-[11px] text-gray-500">
            Drive'da faylga "Havolaga ega har kim ko'ra oladi" ruxsatini bering, aks holda o'quvchilarga video ochilmaydi.
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </form>
      )}

      {canEdit && video && !editing && (
        <div className="flex gap-3 text-xs">
          <button type="button" onClick={() => setEditing(true)} className="text-gray-400 hover:text-white">
            Havolani almashtirish
          </button>
          <button
            type="button"
            onClick={() => save.mutate(null)}
            disabled={save.isPending}
            className="text-red-400/80 hover:text-red-400"
          >
            Videoni olib tashlash
          </button>
        </div>
      )}
    </div>
  );
}

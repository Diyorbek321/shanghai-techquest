import React from 'react';
import { ExternalLink, Github, LayoutGrid, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';

interface GalleryItem {
  id: string;
  title: string;
  track: string | null;
  note: string;
  githubUrl: string | null;
  demoUrl: string | null;
  submittedAt: string | null;
  author: { id: string; name: string; avatar: string | null };
  partner: { id: string; name: string } | null;
  isMine: boolean;
}

/**
 * Work shown to classmates.
 *
 * Everything here was published by its author on purpose — nothing appears
 * because it was graded well or because a teacher liked it. The gallery is
 * bounded to the student's own track rather than the open web: the point is an
 * audience that knows them, not exposure.
 */
export function Gallery() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => api.get<GalleryItem[]>('/gallery'),
  });

  if (isLoading) return <p className="text-sm text-gray-500">Yuklanmoqda...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
          <LayoutGrid className="text-brand-cyan" /> Loyihalar ko'rgazmasi
        </h1>
        <p className="text-gray-400">
          Sinfdoshlaringiz o'zlari ko'rsatishga qaror qilgan ishlar. O'z ishingizni
          qo'yish uchun vazifa sahifasidagi "Ko'rgazmaga qo'yish" tugmasini bosing.
        </p>
      </div>

      {items.length === 0 && (
        <div className="glass-panel p-8 text-center">
          <LayoutGrid className="mx-auto text-gray-600 mb-3" size={36} />
          <p className="text-gray-400">Hali hech kim ish qo'ymagan.</p>
          <p className="text-sm text-brand-cyan mt-2">Birinchi bo'ling — loyihangizni sinfga ko'rsating.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <article
            key={item.id}
            className={`glass-panel p-5 flex flex-col gap-3 ${item.isMine ? 'border-brand-cyan/40' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-white">{item.title}</h2>
              {item.isMine && (
                <span className="shrink-0 text-[10px] uppercase tracking-widest text-brand-cyan">Sizniki</span>
              )}
            </div>

            {item.note && <p className="text-sm text-gray-400">{item.note}</p>}

            <div className="flex items-center gap-2 text-sm text-gray-400">
              {item.author.avatar && (
                <img src={item.author.avatar} alt="" className="w-6 h-6 rounded-full border border-brand-border" />
              )}
              <span>{item.author.name}</span>
              {item.partner && (
                <span className="flex items-center gap-1 text-xs text-brand-orange">
                  <Users size={12} /> {item.partner.name} bilan
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-auto pt-2">
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white"
                >
                  <Github size={14} /> Kod
                </a>
              )}
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-brand-cyan hover:underline"
                >
                  <ExternalLink size={14} /> Demo
                </a>
              )}
              {item.submittedAt && (
                <span className="ml-auto text-[11px] text-gray-600">{formatDate(item.submittedAt)}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

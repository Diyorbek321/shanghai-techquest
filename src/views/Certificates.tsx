import React from 'react';
import { Award, Loader2, Printer } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { formatDate } from '../lib/utils';

interface IssuedCertificate {
  id: string;
  title: string;
  serial: string;
  track: string;
  issuedAt: string;
  lessonsCompleted: number;
  lessonsTotal: number;
}

interface ClaimableCertificate {
  kind: 'month' | 'course';
  month: number | null;
  title: string;
  lessonsCompleted: number;
  lessonsTotal: number;
}

interface CertificatesResponse {
  issued: IssuedCertificate[];
  claimable: ClaimableCertificate[];
  next: { month: number; completed: number; total: number } | null;
}

/**
 * A certificate is the artefact a student shows a parent, so it is built to be
 * printed: the card carries the serial that the school can verify, and
 * `window.print()` is the whole export path — a PDF generator would add a
 * dependency to produce the same sheet of paper.
 */
export function Certificates() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => api.get<CertificatesResponse>('/certificates'),
  });

  const claim = useMutation({
    mutationFn: () => api.post('/certificates', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  });

  if (isLoading) return <p className="text-sm text-gray-500">Yuklanmoqda...</p>;

  const issued = data?.issued ?? [];
  const claimable = data?.claimable ?? [];
  const next = data?.next;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
          <Award className="text-[#FFD700]" /> Sertifikatlar
        </h1>
        <p className="text-gray-400">
          Har bir oyni to'liq tugatganingizda sertifikat beriladi. Kursning barcha oylari
          tugagach — yakuniy sertifikat.
        </p>
      </div>

      {claimable.length > 0 && (
        <div className="glass-panel p-5 border-brand-green/30 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-brand-green">
              {claimable.length} ta sertifikat sizni kutmoqda
            </h2>
            <p className="text-sm text-gray-400">{claimable.map((c) => c.title).join(', ')}</p>
          </div>
          <button
            type="button"
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="shrink-0 px-4 py-2 bg-brand-green text-black font-bold rounded hover:bg-brand-green/90 disabled:opacity-50 text-sm flex items-center gap-2"
          >
            {claim.isPending && <Loader2 size={14} className="animate-spin" />}
            Olish
          </button>
        </div>
      )}

      {claim.isError && (
        <p className="text-sm text-brand-red">
          {claim.error instanceof ApiError ? claim.error.message : "Sertifikat berib bo'lmadi."}
        </p>
      )}

      {issued.length === 0 && claimable.length === 0 && (
        <div className="glass-panel p-8 text-center">
          <Award className="mx-auto text-gray-600 mb-3" size={36} />
          <p className="text-gray-400">Hali sertifikat yo'q.</p>
          {next && (
            <p className="text-sm text-brand-cyan mt-2">
              {next.month}-oy: {next.completed}/{next.total} dars bajarildi. Qolgan{' '}
              {next.total - next.completed} tasini tugatsangiz, birinchi sertifikatingizni olasiz.
            </p>
          )}
        </div>
      )}

      {issued.map((certificate) => (
        <article
          key={certificate.id}
          className="rounded-xl border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#FFD700]/5 to-transparent p-8 print:border-black print:bg-white print:text-black"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFD700] print:text-black">
                Shanghai TechQuest
              </p>
              <h2 className="font-heading text-2xl font-bold mt-1">{certificate.title}</h2>
            </div>
            <Award className="text-[#FFD700] shrink-0 print:text-black" size={40} />
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-gray-500">Yo'nalish</dt>
              <dd className="font-medium">{certificate.track}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-gray-500">Darslar</dt>
              <dd className="font-mono">
                {certificate.lessonsCompleted}/{certificate.lessonsTotal}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-gray-500">Berilgan sana</dt>
              <dd>{formatDate(certificate.issuedAt)}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-gray-500">Raqam</dt>
              <dd className="font-mono text-xs">{certificate.serial}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-[11px] text-gray-500 print:text-black">
              Haqiqiyligini tekshirish: /api/verify/{certificate.serial}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden shrink-0 flex items-center gap-2 px-3 py-1.5 border border-brand-border rounded text-xs hover:bg-white/5"
            >
              <Printer size={14} /> Chop etish
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

import React from 'react';
import { MessageCircleQuestion, Printer, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface ParentReportResponse {
  student: { id: string; name: string };
  weekStart: string;
  report: {
    headline: string;
    highlights: string[];
    conversationStarters: string[];
  };
}

interface Props {
  userId: string;
}

/**
 * The weekly page a student shows a parent.
 *
 * Kept to what was done and to questions worth asking. The counts of missed
 * work that a report like this normally leads with are absent on purpose: the
 * meta-analytic finding is that parental EXPECTATIONS and conversation help,
 * while controlling involvement is associated with a negative effect — so a
 * list of failures would be actively counterproductive, not merely joyless.
 */
export function ParentReportCard({ userId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['parent-report', userId],
    queryFn: () => api.get<ParentReportResponse>(`/parent-report/${userId}`),
  });

  if (isLoading) return <p className="text-sm text-gray-500">Yuklanmoqda...</p>;
  if (!data) return null;

  const { report } = data;

  return (
    <section className="glass-panel p-6 print:bg-white print:text-black">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-brand-cyan print:text-black" size={18} />
          <h2 className="font-semibold text-lg">Ota-onaga haftalik xulosa</h2>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden shrink-0 flex items-center gap-2 px-3 py-1.5 border border-brand-border rounded text-xs hover:bg-white/5"
        >
          <Printer size={14} /> Chop etish
        </button>
      </div>

      <p className="text-gray-200 print:text-black mb-4">{report.headline}</p>

      {report.highlights.length > 0 && (
        <ul className="space-y-1 mb-5 text-sm text-gray-400 print:text-black">
          {report.highlights.map((line) => (
            <li key={line}>— {line}</li>
          ))}
        </ul>
      )}

      <div className="border-t border-brand-border pt-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
          <MessageCircleQuestion size={14} /> Suhbat uchun savollar
        </h3>
        <ul className="space-y-1.5 text-sm text-gray-300 print:text-black">
          {report.conversationStarters.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

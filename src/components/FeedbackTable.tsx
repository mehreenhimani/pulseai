import { Inbox } from 'lucide-react';

export interface FeedbackRow {
  id: string;
  source: string;
  excerpt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  theme: string;
  date: string;
}

interface FeedbackTableProps {
  rows: FeedbackRow[];
}

const sentimentConfig = {
  positive: { label: 'Positive', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  neutral: { label: 'Neutral', className: 'bg-slate-50 text-slate-600 border border-slate-200' },
  negative: { label: 'Negative', className: 'bg-rose-50 text-rose-700 border border-rose-100' },
};

export default function FeedbackTable({ rows }: FeedbackTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Inbox size={24} className="text-slate-400" />
        </div>
        <p className="text-slate-700 font-medium mb-1">No feedback collected yet.</p>
        <p className="text-slate-400 text-sm">Connect your sources to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Source</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Excerpt</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sentiment</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Theme</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const sentiment = sentimentConfig[row.sentiment];
            return (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-700">{row.source}</td>
                <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{row.excerpt}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sentiment.className}`}>
                    {sentiment.label}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">{row.theme}</td>
                <td className="py-3.5 px-4 text-slate-400">{row.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

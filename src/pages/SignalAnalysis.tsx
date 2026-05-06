import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SignalRow {
  id: string;
  feedback_item_id: string;
  sentiment: string;
  score: number;
  themes: string[];
  category: string;
  created_at: string;
  feedback_items: { raw_text: string } | null;
}

interface SummaryStats {
  total: number;
  positiveCount: number;
  negativeCount: number;
}

const sentimentConfig: Record<string, { label: string; className: string }> = {
  positive: { label: 'Positive', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  neutral: { label: 'Neutral', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  negative: { label: 'Negative', className: 'bg-rose-50 text-rose-700 border border-rose-100' },
};

export default function SignalAnalysis() {
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [stats, setStats] = useState<SummaryStats>({ total: 0, positiveCount: 0, negativeCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);

      // Fetch signals first (no join, guaranteed to work)
      const { data: signalData, error: signalError } = await supabase
        .from('signals')
        .select('id, feedback_item_id, sentiment, score, themes, category, created_at')
        .order('created_at', { ascending: false });

      console.group('[SignalAnalysis] fetch');
      console.log('signals data:', signalData, '| error:', signalError?.message);
      console.groupEnd();

      if (cancelled) return;

      if (signalError || !signalData) {
        setLoading(false);
        return;
      }

      // Attempt to enrich with feedback text; failures are non-fatal
      let feedbackMap: Record<string, string> = {};
      const feedbackIds = signalData.map((s) => s.feedback_item_id).filter(Boolean);
      if (feedbackIds.length > 0) {
        const { data: fbData } = await supabase
          .from('feedback_items')
          .select('id, raw_text')
          .in('id', feedbackIds);
        if (fbData) {
          feedbackMap = Object.fromEntries(fbData.map((f) => [f.id, f.raw_text]));
        }
      }

      const rows: SignalRow[] = signalData.map((s) => ({
        ...s,
        feedback_items: feedbackMap[s.feedback_item_id] ? { raw_text: feedbackMap[s.feedback_item_id] } : null,
      }));

      if (!cancelled) {
        setSignals(rows);
        setStats({
          total: rows.length,
          positiveCount: rows.filter((r) => r.sentiment === 'positive').length,
          negativeCount: rows.filter((r) => r.sentiment === 'negative').length,
        });
        setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const positivePct = stats.total > 0 ? Math.round((stats.positiveCount / stats.total) * 100) : 0;
  const negativePct = stats.total > 0 ? Math.round((stats.negativeCount / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">Signal Analysis</h1>
        <p className="text-xs text-slate-400 mt-0.5">AI-powered sentiment and theme extraction</p>
      </header>

      <main className="flex-1 px-8 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Activity size={18} className="text-slate-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Signals</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{loading ? '—' : stats.total}</p>
            <p className="text-xs text-slate-400 mt-1">Analyzed to date</p>
          </div>

          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
              {!loading && stats.total > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  {positivePct}%
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500">Positive Sentiment</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{loading ? '—' : stats.positiveCount}</p>
            <p className="text-xs text-slate-400 mt-1">Signals with positive tone</p>
          </div>

          <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <TrendingDown size={18} className="text-rose-600" />
              </div>
              {!loading && stats.total > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                  {negativePct}%
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500">Negative Sentiment</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{loading ? '—' : stats.negativeCount}</p>
            <p className="text-xs text-slate-400 mt-1">Signals with negative tone</p>
          </div>
        </div>

        {/* Signals table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">All Signals</h2>
            <p className="text-xs text-slate-400 mt-0.5">Joined with source feedback</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : signals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 font-medium">No signals analyzed yet.</p>
              <p className="text-slate-400 text-sm mt-1">Signals appear once feedback has been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Feedback Excerpt</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Sentiment</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-20">Score</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Themes</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">Category</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((row) => {
                    const sConfig = sentimentConfig[row.sentiment] ?? sentimentConfig.neutral;
                    return (
                      <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5 text-slate-600 max-w-xs">
                          <span className="line-clamp-2 text-sm">
                            {row.feedback_items?.raw_text
                              ? row.feedback_items.raw_text.slice(0, 80) + (row.feedback_items.raw_text.length > 80 ? '…' : '')
                              : '—'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${sConfig.className}`}>
                            {sConfig.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 font-medium">
                          {(row.score * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex flex-wrap gap-1">
                            {row.themes.length > 0
                              ? row.themes.map((t) => (
                                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                    {t}
                                  </span>
                                ))
                              : <span className="text-slate-300 text-xs">—</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 text-sm">{row.category || '—'}</td>
                        <td className="py-3.5 px-5 text-slate-400 text-xs">
                          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

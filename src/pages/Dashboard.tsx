import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, BarChart2, Zap, FileText, RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard';
import FeedbackTable from '../components/FeedbackTable';
import type { FeedbackRow } from '../components/FeedbackTable';
import { supabase } from '../lib/supabase';

interface Counts {
  feedback: number;
  signals: number;
  themes: number;
  prds: number;
}

interface RawFeedback {
  id: string;
  source: string;
  raw_text: string;
  created_at: string;
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({ feedback: 0, signals: 0, themes: 0, prds: 0 });
  const [recentFeedback, setRecentFeedback] = useState<FeedbackRow[]>([]);
  const [lastSynced, setLastSynced] = useState<string>('—');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [feedbackRes, signalsRes, themesRes, prdsRes, recentRes] = await Promise.all([
      supabase.from('feedback_items').select('*', { count: 'exact', head: true }),
      supabase.from('signals').select('*', { count: 'exact', head: true }),
      supabase.from('priority_scores').select('theme', { count: 'exact', head: true }),
      supabase.from('prds').select('*', { count: 'exact', head: true }),
      supabase
        .from('feedback_items')
        .select('id, source, raw_text, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    console.group('[Dashboard] Supabase query results');
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('feedback_items  → count:', feedbackRes.count, '| error:', feedbackRes.error?.message);
    console.log('signals         → count:', signalsRes.count, '| error:', signalsRes.error?.message);
    console.log('priority_scores → count:', themesRes.count, '| error:', themesRes.error?.message);
    console.log('prds            → count:', prdsRes.count,    '| error:', prdsRes.error?.message);
    console.log('recent rows     → data:', recentRes.data,   '| error:', recentRes.error?.message);
    console.groupEnd();

    setCounts({
      feedback: feedbackRes.count ?? 0,
      signals: signalsRes.count ?? 0,
      themes: themesRes.count ?? 0,
      prds: prdsRes.count ?? 0,
    });

    const rows: FeedbackRow[] = ((recentRes.data ?? []) as RawFeedback[]).map((r) => ({
      id: r.id,
      source: r.source,
      excerpt: truncate(r.raw_text, 80),
      sentiment: 'neutral',
      theme: '—',
      date: new Date(r.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
    setRecentFeedback(rows);

    const now = new Date();
    setLastSynced(
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Product intelligence overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <RefreshCw size={13} className={`text-slate-300 ${loading ? 'animate-spin' : ''}`} />
          <span>Last synced: {lastSynced}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-8 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Feedback Collected"
            value={loading ? '—' : counts.feedback.toLocaleString()}
            subtitle="Last 7 days"
            accent="blue"
            icon={<MessageSquare size={18} />}
          />
          <StatCard
            title="Signals Analyzed"
            value={loading ? '—' : counts.signals.toLocaleString()}
            subtitle="Sentiment breakdown"
            accent="violet"
            icon={<BarChart2 size={18} />}
          />
          <StatCard
            title="Top Themes"
            value={loading ? '—' : counts.themes.toLocaleString()}
            subtitle="Active this week"
            accent="indigo"
            icon={<Zap size={18} />}
          />
          <StatCard
            title="PRDs Generated"
            value={loading ? '—' : counts.prds.toLocaleString()}
            subtitle="Ready for review"
            accent="purple"
            icon={<FileText size={18} />}
          />
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Feedback</h2>
              <p className="text-xs text-slate-400 mt-0.5">10 most recent entries</p>
            </div>
            <button
              disabled
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-violet-600 text-white opacity-50 cursor-not-allowed"
            >
              Connect Source
            </button>
          </div>
          <FeedbackTable rows={recentFeedback} />
        </div>
      </main>
    </div>
  );
}

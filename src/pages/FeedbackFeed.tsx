import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Source = 'all' | 'app_store' | 'g2' | 'nps' | 'ticket';

interface FeedbackItem {
  id: string;
  source: string;
  raw_text: string;
  rating: number | null;
  created_at: string;
}

const PAGE_SIZE = 10;

const sourceColors: Record<string, string> = {
  app_store: 'bg-blue-50 text-blue-700 border border-blue-100',
  g2: 'bg-orange-50 text-orange-700 border border-orange-100',
  nps: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  ticket: 'bg-slate-100 text-slate-600 border border-slate-200',
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-slate-300 text-sm">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={s <= rating ? '#FBBF24' : '#E2E8F0'}
        >
          <path d="M6 1l1.236 2.506L10 3.93l-2 1.95.472 2.75L6 7.25 3.528 8.63 4 5.88 2 3.93l2.764-.424L6 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeedbackFeed() {
  const [source, setSource] = useState<Source>('all');
  const [rows, setRows] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [source]);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('feedback_items')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (source !== 'all') query = query.eq('source', source);

      const { data, count, error } = await query;
      if (!cancelled && !error) {
        setRows(data ?? []);
        setTotal(count ?? 0);
      }
      if (!cancelled) setLoading(false);
    }
    fetch();
    return () => { cancelled = true; };
  }, [source, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">Feedback Feed</h1>
        <p className="text-xs text-slate-400 mt-0.5">All collected product feedback</p>
      </header>

      <main className="flex-1 px-8 py-8 space-y-5">
        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter size={14} />
            <span className="font-medium">Source</span>
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'app_store', 'g2', 'nps', 'ticket'] as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  source === s
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {s === 'all' ? 'All Sources' : s.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-400">{total} results</span>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 font-medium">No feedback found.</p>
              <p className="text-slate-400 text-sm mt-1">Try a different source filter or connect a data source.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">Source</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Feedback Text</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Rating</th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sourceColors[row.source] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {row.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 max-w-md">
                          <span className="line-clamp-2">{row.raw_text}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <StarRating rating={row.rating} />
                        </td>
                        <td className="py-3.5 px-5 text-slate-400 text-xs">
                          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

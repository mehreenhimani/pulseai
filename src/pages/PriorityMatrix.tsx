import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PriorityRow {
  id: string;
  theme: string;
  rice_score: number;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  evidence_count: number;
}

export default function PriorityMatrix() {
  const [rows, setRows] = useState<PriorityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('priority_scores')
        .select('*')
        .order('rice_score', { ascending: false });

      if (!cancelled && !error) setRows(data ?? []);
      if (!cancelled) setLoading(false);
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">Priority Matrix</h1>
        <p className="text-xs text-slate-400 mt-0.5">RICE-scored feature prioritization</p>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Feature Priority Rankings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sorted by RICE score — highest priority first</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                RICE = (Reach × Impact × Confidence) ÷ Effort
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 font-medium">No priority scores yet.</p>
              <p className="text-slate-400 text-sm mt-1">Run signal analysis to generate RICE scores.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">Rank</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Theme</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">RICE Score</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Reach</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Impact</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Confidence</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Effort</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const isTop = idx === 0;
                    return (
                      <tr
                        key={row.id}
                        className={`border-b transition-colors ${
                          isTop
                            ? 'bg-violet-600 border-violet-500'
                            : 'border-slate-50 hover:bg-slate-50'
                        }`}
                      >
                        <td className={`py-4 px-5 font-bold ${isTop ? 'text-white' : 'text-slate-400'}`}>
                          {isTop ? (
                            <div className="flex items-center gap-1.5">
                              <Trophy size={14} className="text-yellow-300" />
                              <span>#1</span>
                            </div>
                          ) : (
                            `#${idx + 1}`
                          )}
                        </td>
                        <td className={`py-4 px-5 font-semibold ${isTop ? 'text-white' : 'text-slate-800'}`}>
                          {row.theme}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`text-2xl font-bold ${isTop ? 'text-white' : 'text-violet-600'}`}>
                            {Number(row.rice_score).toLocaleString()}
                          </span>
                        </td>
                        <td className={`py-4 px-5 ${isTop ? 'text-violet-200' : 'text-slate-600'}`}>
                          {Number(row.reach).toLocaleString()}
                        </td>
                        <td className={`py-4 px-5 ${isTop ? 'text-violet-200' : 'text-slate-600'}`}>
                          {row.impact}
                        </td>
                        <td className={`py-4 px-5 ${isTop ? 'text-violet-200' : 'text-slate-600'}`}>
                          {row.confidence}%
                        </td>
                        <td className={`py-4 px-5 ${isTop ? 'text-violet-200' : 'text-slate-600'}`}>
                          {row.effort}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isTop ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {row.evidence_count} signals
                          </span>
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

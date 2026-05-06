import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PRD {
  id: string;
  title: string;
  theme: string;
  status: 'draft' | 'reviewed' | 'approved';
  problem_statement: string;
  user_stories: string;
  success_metrics: string;
  proposed_solution: string;
  scope: string;
  timeline: string;
  created_at: string;
}

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-50 text-blue-700 border border-blue-100' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
};

function Section({ label, content }: { label: string; content: string }) {
  if (!content) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</h4>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

function PRDCard({ prd }: { prd: PRD }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[prd.status] ?? statusConfig.draft;

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 ${
      expanded ? 'border-violet-200 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
    }`}>
      {/* Card header */}
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileText size={18} className="text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h3 className="text-base font-semibold text-slate-900 truncate">{prd.title}</h3>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${status.className}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="font-medium text-slate-500">{prd.theme}</span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(prd.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors flex-shrink-0"
        >
          {expanded ? (
            <>Hide PRD <ChevronUp size={13} /></>
          ) : (
            <>View PRD <ChevronDown size={13} /></>
          )}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/50 space-y-6">
          <Section label="Problem Statement" content={prd.problem_statement} />
          <Section label="User Stories" content={prd.user_stories} />
          <Section label="Success Metrics" content={prd.success_metrics} />
          <Section label="Proposed Solution" content={prd.proposed_solution} />
          <Section label="Scope" content={prd.scope} />
          <Section label="Timeline" content={prd.timeline} />
          {!prd.problem_statement && !prd.user_stories && !prd.success_metrics && !prd.proposed_solution && !prd.scope && !prd.timeline && (
            <p className="text-slate-400 text-sm italic">No details available for this PRD.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PRDGenerator() {
  const [prds, setPrds] = useState<PRD[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('prds')
        .select('*')
        .order('created_at', { ascending: false });

      if (!cancelled && !error) setPrds((data ?? []) as PRD[]);
      if (!cancelled) setLoading(false);
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">PRD Generator</h1>
        <p className="text-xs text-slate-400 mt-0.5">Product Requirements Documents from signal themes</p>
      </header>

      <main className="flex-1 px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : prds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-700 font-medium mb-1">No PRDs generated yet.</p>
            <p className="text-slate-400 text-sm">PRDs will appear here once themes reach sufficient signal strength.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {prds.map((prd) => (
              <PRDCard key={prd.id} prd={prd} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

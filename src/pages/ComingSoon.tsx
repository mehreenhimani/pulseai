import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        </div>
      </header>

      {/* Empty state */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <Construction size={28} className="text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Coming Soon</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {description ?? `The ${title} module is under construction. Check back soon for updates.`}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-medium text-violet-600">In development</span>
          </div>
        </div>
      </main>
    </div>
  );
}

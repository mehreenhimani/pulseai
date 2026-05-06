import { Brain, LayoutDashboard, MessageSquare, BarChart2, Zap, FileText } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: 'dashboard' },
  { label: 'Feedback Feed', icon: <MessageSquare size={18} />, path: 'feedback' },
  { label: 'Signal Analysis', icon: <BarChart2 size={18} />, path: 'signals' },
  { label: 'Priority Matrix', icon: <Zap size={18} />, path: 'priority' },
  { label: 'PRD Generator', icon: <FileText size={18} />, path: 'prd' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: '240px', backgroundColor: '#0F172A' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">PulseAI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = activePage === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 text-left group
                ${isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-slate-600">PulseAI v0.1.0</p>
      </div>
    </aside>
  );
}

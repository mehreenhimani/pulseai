interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  accent: 'blue' | 'violet' | 'indigo' | 'purple';
  icon: React.ReactNode;
}

const accentMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    border: 'border-blue-100',
    value: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-500',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'bg-violet-100 text-violet-600',
    border: 'border-violet-100',
    value: 'text-violet-600',
    badge: 'bg-violet-50 text-violet-500',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-100 text-indigo-600',
    border: 'border-indigo-100',
    value: 'text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-500',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    border: 'border-purple-100',
    value: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-500',
  },
};

export default function StatCard({ title, value, subtitle, accent, icon }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div className={`bg-white rounded-xl p-6 border ${colors.border} shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.icon}`}>
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
          Live
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-3xl font-bold tracking-tight ${colors.value}`}>
          {value}
        </p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

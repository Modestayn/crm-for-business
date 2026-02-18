import { GraduationCap, Layers, TrendingUp, ClipboardList } from 'lucide-react';
import { type DashboardStats } from '../../types/admin.ts';

interface StatsBarProps {
  stats: DashboardStats | null;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const statsConfig = [
    { label: 'Студентів', val: stats?.students.val, up: stats?.students.up, icon: <GraduationCap size={20} /> },
    { label: 'Активних груп', val: stats?.groups.val, up: stats?.groups.up, icon: <Layers size={20} /> },
    { label: 'Прибуток', val: stats?.revenue.val, up: stats?.revenue.up, icon: <TrendingUp size={20} /> },
    { label: 'Відвідуваність', val: stats?.attendance.val, up: stats?.attendance.up, icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {statsConfig.map((s, i) => (
        <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              s.up?.includes('+') || s.up === 'Live'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {s.up}
            </span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
          <h4 className="text-2xl font-black mt-1">{s.val || '0'}</h4>
        </div>
      ))}
    </div>
  );
}
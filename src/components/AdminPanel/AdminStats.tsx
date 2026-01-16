// src/components/AdminStats.tsx
import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
}

const AdminStats: React.FC = () => {
  const stats: StatItem[] = [
    { label: 'Користувачі', value: '1,284', trend: '+12%', trendUp: true },
    { label: 'Активні сесії', value: '42', trend: 'Live', trendUp: true },
    { label: 'Завантаження CPU', value: '18%', trend: '-2%', trendUp: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.06] transition-all group"
        >
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            {stat.label}
          </p>
          <div className="flex items-baseline justify-between">
            <h4 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
              {stat.value}
            </h4>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              stat.trend === 'Live'
                ? 'bg-green-500/10 text-green-400 animate-pulse'
                : stat.trendUp ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
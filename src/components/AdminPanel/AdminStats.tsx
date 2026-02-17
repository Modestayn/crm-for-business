import React, { useEffect, useState } from 'react';
import { api } from '../../api/auth.ts';

interface StatItem {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Робимо запит до твого нового API
        const response = await api.get('/api/admin/stats');

        // Нагадаю, твій Laravel повертає: data: { main_stats: [...] }
        if (response.data.status === 'success') {
          setStats(response.data.data.main_stats);
        }
      } catch (error) {
        console.error("Помилка завантаження статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl animate-pulse">
            <div className="h-2 w-16 bg-white/10 rounded mb-2"></div>
            <div className="h-6 w-12 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

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
              stat.trend === 'Live' || stat.trend === '+0%' // Додав умову для Live
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
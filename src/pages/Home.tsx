import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../components/AdminPanel/AdminStats.tsx';
interface Role {
  name: string;
}

interface AdminLog {
  id: number;
  event: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleNames = user?.roles ? user.roles.map((role: Role) => role.name) : [];
  const hasRole = (role: string) => roleNames.includes('admin');

  const [adminLogs] = useState<AdminLog[]>([
    { id: 1, event: 'Новий користувач: root@crm.com', time: '2 хв тому', status: 'success' },
    { id: 2, event: 'Спроба доступу до /api/secure', time: '15 хв тому', status: 'warning' },
    { id: 3, event: 'Систему успішно оновлено', time: '1 год тому', status: 'info' },
    { id: 4, event: 'Бекап БД завершено', time: '3 год тому', status: 'success' },
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] font-sans overflow-hidden">

      {/* Фонові градієнти (Fixed) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className={`relative z-10 w-full transition-all duration-700 ${hasRole('admin') ? 'max-w-6xl' : 'max-w-md'}`}>

        {/* Мобільний Слайдер / Десктопна Сітка */}
        <div className={`
          flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 px-6 pb-10
          md:grid md:overflow-visible md:px-0 md:pb-0
          ${hasRole('admin') ? 'md:grid-cols-2 lg:grid-cols-[1fr_1.3fr]' : 'md:grid-cols-1'}
        `}>

          {/* ПАНЕЛЬ 1: Профіль користувача */}
          <div className="min-w-[88vw] md:min-w-0 snap-center shrink-0">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 text-center flex flex-col items-center h-full min-h-[520px]">

              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <span className="text-3xl font-black text-white uppercase leading-none">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">{user?.name}</h1>
              <p className="text-slate-500 text-xs font-medium mb-6">{user?.email}</p>

              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {roleNames.map((role, idx) => (
                  <span key={idx} className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] uppercase tracking-widest font-bold text-indigo-300">
                    {role}
                  </span>
                ))}
              </div>

              <div className="w-full space-y-4 mt-auto">
                <button
                  onClick={() => navigate('/teacher')}
                  disabled={!roleNames.includes('teacher')}
                  className="group relative w-full py-4 bg-white/5 border border-white/10 text-white text-sm font-extrabold rounded-2xl transition-all hover:bg-white/10 hover:border-indigo-500/50 disabled:opacity-20 active:scale-[0.97]"
                >
                  Секція Викладача
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  disabled={!hasRole('admin')}
                  className="group relative w-full py-4 bg-white/5 border border-white/10 text-white text-sm font-extrabold rounded-2xl transition-all hover:bg-white/10 hover:border-violet-500/50 disabled:opacity-20 active:scale-[0.97]"
                >
                  Секція Адміністратора
                </button>

                <div className="pt-6 border-t border-white/5">
                  <button onClick={handleLogout} className="w-full py-3 text-red-400/80 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors">
                    Вийти з системи
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ПАНЕЛЬ 2: Тільки для Адміна (Статистика + Логи) */}
          {hasRole('admin') && (
            <div className="min-w-[88vw] md:min-w-0 snap-center shrink-0">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full min-h-[520px]">

                {/* Хедер панелі з "Змійкою" */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Моніторинг</h2>
                    <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em] font-bold">System Status</p>
                  </div>
                  <div className="flex space-x-1.5 items-center bg-white/5 px-3 py-2 rounded-full border border-white/5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>

                {/* Компонент статистики */}
                <AdminStats />

                {/* Список логів з кастомним скролом */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar max-h-[220px]">
                  {adminLogs.map((log) => (
                    <div key={log.id} className="group flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px] ${
                        log.status === 'success' ? 'bg-green-400 shadow-green-400/50' :
                          log.status === 'warning' ? 'bg-amber-400 shadow-amber-400/50' : 'bg-blue-400 shadow-blue-400/50'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-slate-200 text-xs font-semibold truncate pr-2">{log.event}</span>
                          <span className="text-slate-600 text-[9px] whitespace-nowrap">{log.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-indigo-300/50 text-[10px] font-medium italic md:hidden">
                    ← Гортайте вліво для профілю
                  </p>
                  <p className="hidden md:block text-slate-600 text-[9px] uppercase tracking-[0.3em]">
                    Secure Admin Link Active
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Пагінація для мобільних */}
        {hasRole('admin') && (
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
          </div>
        )}

        <p className="mt-10 text-center text-slate-700 text-[10px] uppercase tracking-[0.4em] font-bold">
          Platform Dashboard v2.4.0
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
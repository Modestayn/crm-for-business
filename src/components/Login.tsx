// src/compoments/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка входу. Спробуйте ще раз.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans">
      {/* Анімовані фонові елементи */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-md p-2">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-[2rem] p-8 md:p-10">

          {/* Заголовок */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Вітаємо знову
            </h2>
            <p className="text-slate-400 text-sm">Введіть свої дані для входу в систему</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Поле Email */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Електронна пошта
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 group-hover:border-white/20"
                required
              />
            </div>

            {/* Поле Пароль */}
            <div className="group">
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Пароль
                </label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Забули?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 group-hover:border-white/20"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Кнопка входу */}
            <button
              type="submit"
              className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] active:scale-[0.97] transition-all duration-200"
            >
              Увійти в кабінет
            </button>
          </form>

          {/* Футер форми */}
          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Ще не маєте аккаунту?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-white font-semibold hover:underline decoration-indigo-500 underline-offset-4 transition-all"
              >
                Створити зараз
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
          Раді вітати у нашій CRM системі!
        </p>
      </div>
    </div>
  );
};

export default Login;
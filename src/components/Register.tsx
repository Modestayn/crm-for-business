// src/compoments/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Помилка реєстрації. Спробуйте ще раз.';
      setError(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans">
      {/* Динамічний фон - ті самі сфери для консистентності */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md p-[0 40px 0 40px]">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-12">

          {/* Заголовок */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black tracking-tight text-white mb-3">
              Створити аккаунт
            </h2>
            <p className="text-slate-400 text-sm">Приєднуйтесь до нашої спільноти</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Поле Ім'я */}
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">
                Ваше ім'я
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Олександр"
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                required
              />
            </div>

            {/* Поле Email */}
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">
                Електронна пошта
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                required
              />
            </div>

            {/* Поле Пароль */}
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-5 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-500/5 py-2 rounded-lg border border-red-500/10">
                {error}
              </p>
            )}

            {/* Кнопка реєстрації */}
            <button
              type="submit"
              className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] active:scale-[0.97] transition-all duration-200"
            >
              Зареєструватися
            </button>
          </form>

          {/* Перехід на вхід */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">
              Вже маєте профіль?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                Увійти
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

export default Register;
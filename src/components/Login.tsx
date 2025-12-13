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
    <>
      <div className="liquid-blob"></div>
      <div className="liquid-container flex items-center justify-center min-h-screen p-4">

        {/* Форма Входу з ефектом білого скла */}
        <div className="max-w-md w-full p-8 bg-white bg-opacity-70 shadow-2xl rounded-3xl border border-gray-300 border-opacity-50 z-20 transition duration-500  backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Вхід</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="cursor-pointer w-full py-3 px-4 bg-yellow-500 text-gray-900 font-extrabold rounded-xl hover:shadow-[4px_4px_#000000] transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Увійти
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Немає облікового запису?
            <span
              onClick={() => navigate('/register')}
              className="text-yellow-600 hover:text-yellow-700 ml-1 cursor-pointer font-medium"
            >
              Зареєструватися
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
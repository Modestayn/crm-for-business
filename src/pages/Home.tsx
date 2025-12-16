// src/pages/Home.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// !!! ВИПРАВЛЕНО: Додаємо визначення типу для ролей, щоб уникнути помилок Typescript !!!
interface Role {
  name: string;
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Отримуємо масив імен ролей ['teacher', 'admin']
  // !!! КОРЕКТНА ОБРОБКА РОЛЕЙ !!!
  const roleNames = user?.roles
    ? user.roles.map((role: Role) => role.name)
    : [];

  // Допоміжна функція для перевірки ролі
  const hasRole = (role: string) => roleNames.includes(role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <div className="liquid-blob"></div>

      <div className="liquid-container flex flex-col items-center justify-center p-5">

        {/* Content Card (Світлий фон, Темний текст, Жовті акценти) */}
        <div className="bg-white bg-opacity-70 p-10 rounded-3xl shadow-2xl border border-gray-300 border-opacity-50 z-20 text-center max-w-lg w-full transform transition duration-500 hover:scale-[1.02] backdrop-blur-sm">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            Вітаємо, {user?.name || 'Користувачу'}!
          </h1>
          <p className="text-gray-700 text-lg mb-2">
            Email: <span className="font-semibold text-yellow-700">{user?.email}</span>
          </p>
          <p className="text-gray-700 text-lg mb-6">
            {/* !!! ВИПРАВЛЕНО: Виводимо коректний список імен ролей !!! */}
            Ваші Ролі: <span className="font-semibold text-yellow-700">{roleNames.join(', ') || 'Немає'}</span>
          </p>

          <p className="text-gray-500 mb-8 italic">
            Насолоджуйтесь білим ліквідним інтерфейсом!
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/teacher')}
              className="w-full py-3 px-6 bg-yellow-500 text-gray-900 font-extrabold rounded-xl hover:bg-yellow-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              // !!! ВИПРАВЛЕНО: Використовуємо коректну перевірку hasRole !!!
              disabled={!hasRole('teacher')}
            >
              Перейти до Секції Викладача
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-3 px-6 bg-yellow-500 text-gray-900 font-extrabold rounded-xl hover:bg-yellow-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              // !!! ВИПРАВЛЕНО: Використовуємо коректну перевірку hasRole !!!
              disabled={!hasRole('admin')}
            >
              Перейти до Секції Адміністратора
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 px-6 bg-gray-900 text-white border border-yellow-500 font-bold rounded-xl hover:bg-gray-800 transition duration-300 shadow-md mt-4"
            >
              Вийти
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
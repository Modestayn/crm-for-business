import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  /** * Необов'язковий масив ролей (наприклад, ['admin', 'teacher']),
   * які необхідні для доступу до цього маршруту.
   */
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // 1. Поки йде завантаження автентифікації, показуємо спінер (або нічого)
  if (isLoading) {
    // У цьому випадку ми використовуємо індикатор завантаження, який був визначений в AuthContext,
    // але тут можна додати локальний спінер.
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-yellow-500">
        <h1 className="text-xl">Перевірка доступу...</h1>
      </div>
    );
  }

  // 2. Якщо користувач не автентифікований, перенаправляємо його на сторінку входу
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Якщо потрібна перевірка ролей
  if (requiredRoles && user) {
    const userRoles = user.roles as { name: string }[] | undefined;
    // !!! ВИПРАВЛЕНО: КОРЕКТНА ПЕРЕВІРКА РОЛЕЙ ТА ЗАХИСТ ВІД TYPESCRIPT (user.roles не є масивом рядків) !!!
    const hasRequiredRole = requiredRoles.some(role => userRoles?.some(r => r.name === role));

    if (!hasRequiredRole) {
      // Якщо користувач автентифікований, але не має потрібної ролі,
      // перенаправляємо на головну сторінку або сторінку "403 Доступ заборонено"

      // !!! ВИПРАВЛЕНО: НАЙПРОСТІШЕ РІШЕННЯ - ОДРАЗУ ПЕРЕНАПРАВИТИ !!!
      // Це усуває помилку з кнопкою `onClick` та спрощує логіку.
      return <Navigate to="/" replace />;

      /*
      // Оригінальний блок "403 Доступ заборонено" (закоментовано, щоб уникнути помилок):
      return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <div className="text-center p-10 bg-yellow-900/50 rounded-lg">
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">403 Доступ заборонено</h1>
            <p className="text-lg">У вас немає необхідних ролей ({requiredRoles.join(', ')}) для доступу до цієї сторінки.</p>
            <button
              onClick={() => <Navigate to="/" replace />} // ПОМИЛКА ТУТ!
              className="mt-6 py-2 px-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              На головну
            </button>
          </div>
        </div>
      );
      */
    }
  }

  // 4. Якщо всі перевірки успішні, відображаємо вкладені маршрути
  return <Outlet />;
};

export default ProtectedRoute;
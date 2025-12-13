// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Припускаємо, що AuthProvider знаходиться у src/context/AuthContext
import { AuthProvider, useAuth } from './context/AuthContext';
// Виправлені шляхи до папки 'compoments'
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home'; // Використовуємо Home.tsx
import ProtectedRoute from './components/ProtectedRoute'; // Потрібен для захисту сторінок

// Допоміжні компоненти
const AdminPage = () => (
  <div className="p-10 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-4 text-black">Адмін Панель (Роль: admin)</h1>
    <p className="mb-2">Тут реалізовано захист роллю 'admin'.</p>
    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
      <li>Отримати список усіх користувачів: <code className="bg-gray-200 p-1 rounded">GET /api/admin/users</code></li>
      <li>Створити нового користувача: <code className="bg-gray-200 p-1 rounded">POST /api/admin/users</code></li>
      <li>Отримати деталі конкретного користувача: <code className="bg-gray-200 p-1 rounded">GET /api/admin/users/&#123;id&#125;</code></li>
      <li>Оновити дані користувача: <code className="bg-gray-200 p-1 rounded">PUT/PATCH /api/admin/users/&#123;id&#125;</code></li>
      <li>Видалити користувача: <code className="bg-gray-200 p-1 rounded">DELETE /api/admin/users/&#123;id&#125;</code></li>
    </ul>
  </div>
);
const TeacherPage = () => (
  <div className="p-10 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-4 text-black">Панель Викладача (Роль: teacher)</h1>
    <p className="mb-2">Тут реалізовано захист роллю 'teacher'.</p>
    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
      <li>Отримати список груп: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/groups</code></li>
      <li>Отримати деталі певної групи: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/groups/&#123;id&#125;</code></li>
      <li>Отримати список студентів: <code className="bg-gray-200 p-1 rounded">GET /api/teacher/students</code></li>
      <li>Оновити оцінку для студента: <code className="bg-gray-200 p-1 rounded">PUT/PATCH /api/teacher/students/&#123;id&#125;/grade</code></li>
    </ul>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Публічні маршрути */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

      {/* Захищені маршрути */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Захищені маршрути з перевіркою ролей */}
      <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRoles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<div className="p-10"><h1>404 Сторінка не знайдена</h1></div>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
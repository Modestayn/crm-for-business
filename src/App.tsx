// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Admin from './pages/Admin'
import Teacher from './pages/Teacher'
import ProtectedRoute from './components/ProtectedRoute';


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
        <Route path="/admin" element={<Admin/>} />
      </Route>

      <Route element={<ProtectedRoute requiredRoles={['teacher']} />}>
        <Route path="/teacher" element={<Teacher/>} />
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
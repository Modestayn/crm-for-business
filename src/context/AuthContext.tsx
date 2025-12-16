// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import type { User } from '../types/auth';
// !!! ВИПРАВЛЕНО: ДОДАНО ІМПОРТ AXIOS !!!
import axios from 'axios';

// !!! ВИПРАВЛЕНО: Визначаємо тип, який включає ролі (потрібно для ProtectedRoute) !!!
type UserWithRoles = User & { roles?: { name: string }[] };

interface AuthContextType {
  // !!! ВИПРАВЛЕНО: Використовуємо розширений тип для user !!!
  user: UserWithRoles | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // !!! ВИПРАВЛЕНО: Використовуємо розширений тип у useState !!!
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await fetchCurrentUser();

      // !!! ВИПРАВЛЕНО: Примусове приведення типу. Це може бути єдиним способом, якщо ваш fetchCurrentUser
      // повертає лише User, але ми знаємо, що він повертає User із ролями.
      setUser(userData as UserWithRoles);

    } catch (error) {
      // !!! КРИТИЧНЕ ВИПРАВЛЕННЯ: БЕЗПЕЧНА ОБРОБКА ПОМИЛОК AXIOS !!!
      // Цей блок запобігає падінню "reading 'json'" і приховує помилки 401.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Очікувана помилка: користувач не увійшов.
        console.log("User not logged in (401 response).");
      } else {
        // Інша, невідома помилка, або проблема з бекендом
        console.error("Error loading current user:", error);
      }
      // Очищуємо стан користувача, щоб продовжити роботу як гість
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    await apiLogin(email, password);
    await loadUser();
  };

  const register = async (name: string, email: string, password: string) => {
    await apiRegister(name, email, password);
    await loadUser();
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-xl text-gray-700">Перевірка автентифікації...</h1>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
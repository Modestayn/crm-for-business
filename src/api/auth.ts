import axios from 'axios';
import type { User } from '../types/auth';

// Базовий URL для ваших API-ендпоінтів
const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Цей параметр критично важливий для Session-based SPA (Laravel Sanctum),
  // оскільки він дозволяє браузеру надсилати та приймати Cookie з автентифікацією
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// =========================================================================
// !!! КРИТИЧНЕ ВИПРАВЛЕННЯ: ДОДАЄМО INTERCEPTOR ДЛЯ XSRF-ТОКЕНА !!!
// Це змушує Axios явно читати Cookie і додавати його до заголовка X-XSRF-TOKEN
// перед кожним запитом (якщо Cookie існує).
// =========================================================================
api.interceptors.request.use(config => {
  // Функція для отримання Cookie за назвою
  const getCookie = (name: string) => {
    // Шукаємо Cookie у document.cookie
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      // Розкодовуємо та повертаємо токен
      const token = parts.pop()?.split(';').shift();
      return token ? decodeURIComponent(token) : null;
    }
    return null;
  };

  const xsrfToken = getCookie('XSRF-TOKEN');

  if (xsrfToken) {
    // Встановлюємо заголовок, який Laravel очікує
    config.headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  return config;
}, error => {
  return Promise.reject(error);
});
// =========================================================================


/**
 * Реєстрація нового користувача. Ендпоінт: POST /register
 */
export const register = async (name: string, email: string, password: string) => {
  // Для Laravel Sanctum SPA: спочатку отримуємо CSRF-токен
  await api.get('/sanctum/csrf-cookie');
  // Interceptor додасть токен до заголовка
  const response = await api.post('/register', { name, email, password, password_confirmation: password });
  return response.data;
};

/**
 * Вхід користувача. Створює сесію і встановлює Cookie. Ендпоінт: POST /login
 */
export const login = async (email: string, password: string) => {
  // Для Laravel Sanctum SPA: спочатку отримуємо CSRF-токен
  await api.get('/sanctum/csrf-cookie');
  // Interceptor додасть токен до заголовка
  const response = await api.post('/login', { email, password });
  return response.data;
};

/**
 * Вихід користувача. Знищує сесію. Ендпоінт: POST /logout
 */
export const logout = async () => {
  // Крок 1: Отримати/Оновити CSRF-токен у Cookie
  await api.get('/sanctum/csrf-cookie');
  // Interceptor додасть токен до заголовка
  await api.post('/logout');
};

/**
 * Отримати дані поточного користувача, включаючи його ролі. Ендпоінт: GET /api/user
 */
export const fetchCurrentUser = async (): Promise<User> => {
  // !!! КРИТИЧНЕ ВИПРАВЛЕННЯ: Обгортаємо у try/catch для коректної обробки помилок 401 !!!
  try {
    const response = await api.get('/api/user');
    return response.data;
  } catch (error) {
    // Якщо Axios кидає помилку (наприклад, 401 Unauthorized, коли користувач не увійшов),
    // ми просто кидаємо її далі.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw error;
    }
    // Кидаємо будь-яку іншу помилку
    throw error;
  }
};
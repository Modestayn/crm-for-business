import axios from 'axios';
import type { User } from '../types/auth';
// Базовий URL для ваших API-ендпоінтів
const API_BASE_URL = 'http://localhost:8000/api'; // ***Змініть на фактичний URL вашого бекенду***

const api = axios.create({
  baseURL: API_BASE_URL,
  // Цей параметр критично важливий для Session-based SPA (Laravel Sanctum),
  // оскільки він дозволяє браузеру надсилати та приймати Cookie з автентифікацією
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Реєстрація нового користувача. Ендпоінт: POST /register
 */
export const register = async (name: string, email: string, password: string) => {
  // Для Laravel Sanctum SPA: спочатку отримуємо CSRF-токен
  // Якщо цей запит не потрібен вашому бекенду, його можна видалити.
  await api.get('/sanctum/csrf-cookie');

  const response = await api.post('/register', { name, email, password, password_confirmation: password });
  return response.data;
};

/**
 * Вхід користувача. Створює сесію і встановлює Cookie. Ендпоінт: POST /login
 */
export const login = async (email: string, password: string) => {
  // Для Laravel Sanctum SPA: спочатку отримуємо CSRF-токен
  await api.get('/sanctum/csrf-cookie');

  const response = await api.post('/login', { email, password });
  return response.data;
};

/**
 * Вихід користувача. Знищує сесію. Ендпоінт: POST /logout
 */
export const logout = async () => {
  // Для цього запиту потрібна Auth (тобто Cookie повинні бути надіслані)
  await api.post('/logout');
};

/**
 * Отримати дані поточного користувача, включаючи його ролі. Ендпоінт: GET /api/user
 */
export const fetchCurrentUser = async (): Promise<User> => {
  // Для цього запиту потрібна Auth (Cookie)
  const response = await api.get('/user');
  return response.data;
};
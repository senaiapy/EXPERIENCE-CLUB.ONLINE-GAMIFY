import { Env } from '@env';
import axios from 'axios';
import { getToken, removeToken } from '@/lib/auth/utils';

export const client = axios.create({
  baseURL: Env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
client.interceptors.request.use(
  async (config) => {
    const token = getToken();
    // Only add Authorization header if we have a valid token
    if (token && token.access) {
      config.headers.Authorization = `Bearer ${token.access}`;
    } else {
      // Remove Authorization header if no token (for public endpoints)
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      removeToken();
      // Optionally trigger a global event for auth state change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

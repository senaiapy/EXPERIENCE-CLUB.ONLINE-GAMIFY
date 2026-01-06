import axios from 'axios';

// Create axios instance with dynamic baseURL for server/client side
const getBaseURL = () => {
  // Server-side (during build and SSR)
 // if (typeof window === 'undefined') {
 //   return process.env.API_URL || 'http://backend:3002/api';
 // }
  // Client-side (browser)
  return process.env.NEXT_PUBLIC_API_URL;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', config.url, '- Token:', token.substring(0, 50) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.config?.url, '- Status:', error.response?.status);
    // Handle common errors
    if (error.response?.status === 401) {
      console.error('🔒 401 Unauthorized - Token invalid or expired');
      // Clear auth data but don't redirect automatically
      // Let pages handle the error appropriately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin_authenticated');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
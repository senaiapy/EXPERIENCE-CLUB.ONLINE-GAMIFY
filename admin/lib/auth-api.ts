import { api } from './axios';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// Auth API service
export const authApi = {
  // Login
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    console.log('🔐 Login response:', response.data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Token stored:', response.data.access_token.substring(0, 50) + '...');
      console.log('✅ User stored:', response.data.user.email, '- Role:', response.data.user.role);
    } else {
      console.error('❌ No access_token in response!');
    }
    return response.data;
  },

  // Register
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Get stored user
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  },
};
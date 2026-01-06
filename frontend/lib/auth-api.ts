import { api } from './axios';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
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
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
    // Backend returns userId instead of id, and doesn't include createdAt
    // Map the response to match our User interface
    const profileData = response.data;
    return {
      id: profileData.userId || profileData.id,
      email: profileData.email,
      name: profileData.name,
      role: profileData.role,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      country: profileData.country,
      postalCode: profileData.postalCode,
      createdAt: profileData.createdAt || new Date().toISOString(),
    };
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
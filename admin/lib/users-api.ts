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
  updatedAt?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  password?: string;
}

// Users API service (Admin only)
export const usersApi = {
  // Get all users
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default usersApi;
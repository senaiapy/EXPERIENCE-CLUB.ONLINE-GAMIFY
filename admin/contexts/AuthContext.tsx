'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User } from '@/lib/auth-api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const token = authApi.getToken();
    const storedUser = authApi.getUser();

    if (token && storedUser) {
      try {
        // Verify token is still valid by fetching profile
        const profile = await authApi.getProfile();

        // Check if user has ADMIN role
        if (profile.role !== 'ADMIN') {
          console.error('Access denied: User is not an admin');
          authApi.logout();
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('admin_authenticated');
          setIsLoading(false);
          return;
        }

        setUser(profile);
        setIsAuthenticated(true);
        // Set admin_authenticated for backward compatibility with AdminLayout
        localStorage.setItem('admin_authenticated', 'true');
      } catch (error) {
        // Token is invalid or expired
        authApi.logout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('admin_authenticated');
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('admin_authenticated');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });

      // Check if user has ADMIN role
      if (response.user.role !== 'ADMIN') {
        console.error('Access denied: User is not an admin');
        authApi.logout();
        throw new Error('Acceso denegado: Solo los administradores pueden acceder al panel de administración');
      }

      setUser(response.user);
      setIsAuthenticated(true);
      // Set admin_authenticated for backward compatibility with AdminLayout
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
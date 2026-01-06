'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Loading component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
    </div>
  );
}

// Main Page Component - Redirect based on auth status
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) {
      console.log('🔍 Checking authentication status...');
      return;
    }

    // Redirect based on authentication
    if (isAuthenticated) {
      console.log('✅ User authenticated - Redirecting to game page');
      router.replace('/game');
    } else {
      console.log('❌ User not authenticated - Redirecting to login page');
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth or redirecting
  return <HomeLoading />;
}
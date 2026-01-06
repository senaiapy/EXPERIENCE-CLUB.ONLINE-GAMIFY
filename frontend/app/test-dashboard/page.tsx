'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestDashboard() {
  const auth = useAuth();

  useEffect(() => {
    console.log('=== TEST DASHBOARD ===');
    console.log('Auth context:', auth);
    console.log('User:', auth.user);
    console.log('isAuthenticated:', auth.isAuthenticated);
    console.log('isLoading:', auth.isLoading);

    if (auth.user) {
      console.log('User details:',  {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        role: auth.user.role,
        createdAt: auth.user.createdAt
      });
    }
  }, [auth]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard - Auth Debug</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">Auth State:</h2>
        <pre className="text-sm">
          {JSON.stringify({
            isAuthenticated: auth.isAuthenticated,
            isLoading: auth.isLoading,
            hasUser: !!auth.user
          }, null, 2)}
        </pre>
      </div>

      {auth.user && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">User Data:</h2>
          <pre className="text-sm">
            {JSON.stringify(auth.user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
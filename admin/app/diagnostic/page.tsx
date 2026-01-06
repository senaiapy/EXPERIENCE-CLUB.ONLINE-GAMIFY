'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
  const [apiTest, setApiTest] = useState<any>(null);
  const [authTest, setAuthTest] = useState<any>(null);
  const [storageTest, setStorageTest] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    try {
      // Test 1: Check localStorage
      const storage = {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        admin_authenticated: localStorage.getItem('admin_authenticated')
      };
      setStorageTest(storage);

      // Test 2: Test API directly
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=3`);
      const apiData = await apiResponse.json();
      setApiTest({
        status: apiResponse.status,
        ok: apiResponse.ok,
        data: apiData,
        firstProduct: apiData.products?.[0]
      });

      // Test 3: Test auth
      if (storage.token) {
        try {
          const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${storage.token}`
            }
          });
          const authData = await authResponse.json();
          setAuthTest({
            status: authResponse.status,
            ok: authResponse.ok,
            data: authData
          });
        } catch (authError: any) {
          setAuthTest({
            error: authError.message
          });
        }
      } else {
        setAuthTest({ message: 'No token in localStorage' });
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Diagnostic error:', err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Diagnostic Page</h1>

      <div className="space-y-6">
        {/* Storage Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">1. LocalStorage Test</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(storageTest, null, 2)}
          </pre>
        </div>

        {/* API Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">2. API Connection Test</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </div>

        {/* Auth Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-purple-600">3. Auth Test</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(authTest, null, 2)}
          </pre>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Product Type Test */}
        {apiTest?.firstProduct && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-orange-600">4. Product Data Types</h2>
            <div className="space-y-2 text-sm">
              <p><strong>price:</strong> {apiTest.firstProduct.price} (type: {typeof apiTest.firstProduct.price})</p>
              <p><strong>price_sale:</strong> {apiTest.firstProduct.price_sale} (type: {typeof apiTest.firstProduct.price_sale})</p>
              <p><strong>stockQuantity:</strong> {apiTest.firstProduct.stockQuantity} (type: {typeof apiTest.firstProduct.stockQuantity})</p>
              <p><strong>images:</strong> {apiTest.firstProduct.images ? `Array[${apiTest.firstProduct.images.length}]` : 'null/undefined'}</p>
              <p><strong>brand:</strong> {apiTest.firstProduct.brand?.name || 'null'}</p>
              <p><strong>category:</strong> {apiTest.firstProduct.category?.name || 'null'}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-400 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">📋 Instructions</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Take a screenshot of this entire page</li>
            <li>Open browser DevTools (F12)</li>
            <li>Go to Console tab</li>
            <li>Look for any RED error messages</li>
            <li>Copy the full error text</li>
            <li>Also check the Network tab for failed requests</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
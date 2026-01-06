'use client';

import { useState, useEffect } from 'react';

export default function ProductsTestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=5`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      console.log('API Response:', json);

      setData(json);
      setError(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Products API Test - Loading...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">{error}</p>
        </div>
        <button
          onClick={loadData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products API Test - Success!</h1>

      <div className="mb-6 bg-green-50 border border-green-200 rounded p-4">
        <p className="text-green-800">✅ API Response received successfully</p>
        <p className="text-sm text-green-600 mt-2">
          Total products: {data?.pagination?.total || 0}
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4">Raw API Response:</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>

      <h2 className="text-xl font-bold mt-6 mb-4">Products List:</h2>
      <div className="space-y-4">
        {data?.products?.map((product: any, index: number) => (
          <div key={product.id || index} className="bg-white border rounded-lg p-4 shadow">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">ID:</span> {product.id}
              </div>
              <div>
                <span className="font-semibold">Price:</span> {product.price} (type: {typeof product.price})
              </div>
              <div>
                <span className="font-semibold">Price Sale:</span> {product.price_sale} (type: {typeof product.price_sale})
              </div>
              <div>
                <span className="font-semibold">Stock:</span> {product.stockQuantity}
              </div>
              <div>
                <span className="font-semibold">Brand:</span> {product.brand?.name}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {product.category?.name}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Images:</span> {product.images?.length || 0} image(s)
                {product.images && product.images.length > 0 && (
                  <span className="ml-2 text-gray-600">
                    (Has images array: {Array.isArray(product.images) ? 'YES' : 'NO'})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
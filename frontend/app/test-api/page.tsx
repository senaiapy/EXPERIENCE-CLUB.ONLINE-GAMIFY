'use client';

import { useState, useEffect } from 'react';
import { productsApi, Product } from '../../lib/products-api';
import { convertAndFormatPrice, formatUsdPrice } from '../../lib/currency';

export default function TestApi() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Testing API connection...');

        const response = await productsApi.getProducts({ page: 1, limit: 5 });
        setProducts(response.products);
        setTotalProducts(response.pagination.total);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
        <div className="bg-blue-100 border border-blue-400 rounded p-4">
          <h2 className="text-xl font-semibold text-blue-800">🔄 Testing API Connection...</h2>
          <p className="text-blue-700">Please wait while we test the connection to the backend API.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
        <div className="bg-red-100 border border-red-400 rounded p-4">
          <h2 className="text-xl font-semibold text-red-800">❌ API Connection Failed</h2>
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Test Results</h1>

      <div className="bg-green-100 border border-green-400 rounded p-4 mb-6">
        <h2 className="text-xl font-semibold text-green-800">✅ API Connection Successful!</h2>
        <p className="text-green-700">
          Total Products: <strong>{totalProducts.toLocaleString()}</strong>
        </p>
        <p className="text-green-700">
          Products in this response: <strong>{products.length}</strong>
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Sample Products:</h3>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-300 rounded p-4 bg-white">
            <h4 className="font-semibold text-lg">{product.name}</h4>
            <p className="text-gray-600">Brand: {product.brand?.name || 'N/A'}</p>
            <p className="text-gray-600">Category: {product.category?.name || 'N/A'}</p>
            <p className="text-green-600 font-semibold">
              USD Price: {formatUsdPrice(product.price)}
            </p>
            <p className="text-green-600 font-semibold">
              Guaraní Price: {convertAndFormatPrice(product.price)}
            </p>
            {product.price_sale && (
              <p className="text-red-600 font-semibold">
                Sale Price: {formatUsdPrice(product.price_sale)} ({convertAndFormatPrice(product.price_sale)})
              </p>
            )}
            <p className="text-sm text-gray-500">Stock: {product.stockStatus}</p>
            <p className="text-sm text-gray-400">ID: {product.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
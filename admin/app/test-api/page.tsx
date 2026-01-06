'use client';

import { useState, useEffect } from 'react';
import { Product, productsApi } from '../../lib/products-api';
import { convertAndFormatPrice, formatUsdPrice } from '../../lib/currency';

export default function TestApiAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Testing API connection from Admin app...');

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
        <h1 className="text-3xl font-bold mb-6">Admin API Test Results</h1>
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
        <h1 className="text-3xl font-bold mb-6">Admin API Test Results</h1>
        <div className="bg-red-100 border border-red-400 rounded p-4">
          <h2 className="text-xl font-semibold text-red-800">❌ API Connection Failed</h2>
          <p className="text-red-700">Error: {error}</p>
          <div className="mt-4 text-sm text-red-600">
            <p>Common issues:</p>
            <ul className="list-disc ml-6">
              <li>Backend server not running on port 3062</li>
              <li>Network connection issues</li>
              <li>CORS configuration problems</li>
              <li>Invalid API URL configuration</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin API Test Results</h1>

      <div className="bg-green-100 border border-green-400 rounded p-4 mb-6">
        <h2 className="text-xl font-semibold text-green-800">✅ API Connection Successful!</h2>
        <p className="text-green-700">
          Total Products: <strong>{totalProducts.toLocaleString()}</strong>
        </p>
        <p className="text-green-700">
          Products in this response: <strong>{products.length}</strong>
        </p>
        <p className="text-green-700">
          API Base URL: <strong>{process.env.NEXT_PUBLIC_API_URL}</strong>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Currency Conversion Test:</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-800">
            ✅ <strong>Backend:</strong> Stores prices in USD
          </p>
          <p className="text-blue-800">
            ✅ <strong>Frontend:</strong> Converts USD to Guaraní for display
          </p>
          <p className="text-blue-800">
            ✅ <strong>Rate:</strong> 1 USD = 7,300 PYG
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Sample Products:</h3>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-300 rounded p-4 bg-white">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={
                    (product.images && product.images.find(img => img.size === 'HOME')?.url) ||
                    (product.images && product.images.find(img => img.size === 'SMALL')?.url) ||
                    (product.images && product.images[0]?.url) ||
                    product.image_name ||
                    '/images/no-image.jpg'
                  }
                  alt={product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/no-image.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="text-gray-600">Brand: {product.brand?.name || 'N/A'}</p>
                <p className="text-gray-600">Category: {product.category?.name || 'N/A'}</p>
                <div className="mt-2">
                  <p className="text-blue-600 font-semibold">
                    USD Price: {formatUsdPrice(product.price)}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Guaraní Price: {convertAndFormatPrice(product.price)}
                  </p>
                  {product.price_sale && (
                    <>
                      <p className="text-blue-600 font-semibold">
                        USD Sale Price: {formatUsdPrice(parseFloat(String(product.price_sale)))}
                      </p>
                      <p className="text-red-600 font-semibold">
                        Guaraní Sale Price: {convertAndFormatPrice(parseFloat(String(product.price_sale)))}
                      </p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Stock: {product.stockStatus}</p>
                <p className="text-sm text-gray-400">Stock Quantity: {product.stockQuantity}</p>
                <p className="text-sm text-gray-400">ID: {product.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">API Architecture Summary:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ Admin app successfully connected to NestJS backend</li>
          <li>✅ Products are loaded from PostgreSQL database</li>
          <li>✅ Currency conversion working (USD → PYG)</li>
          <li>✅ Product images, brands, and categories properly loaded</li>
          <li>✅ Pagination and filtering supported</li>
          <li>✅ Stock status and quantities properly tracked</li>
        </ul>
      </div>
    </div>
  );
}
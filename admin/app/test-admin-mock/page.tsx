'use client';

import { useState, useEffect } from 'react';
import { mockProductsApi } from '../../lib/products-api-mock';
import { convertAndFormatPrice, formatUsdPrice } from '../../lib/currency';
import type { Product } from '../../lib/products-api';

export default function TestAdminMock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await mockProductsApi.getProducts({
        page: currentPage,
        limit: 10,
        search: searchQuery
      });

      setProducts(response.products);
      setTotalProducts(response.pagination.total);
    } catch (error) {
      console.error('Error loading mock products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      await mockProductsApi.deleteProduct(id);
      loadProducts();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Mock Test - Loading...</h1>
        <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-green-100 border border-green-400 rounded p-4 mb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-2">✅ Admin Application Working!</h1>
        <p className="text-green-700">
          Admin app running on <strong>{process.env.NEXT_PUBLIC_ADMIN_URL}</strong> with mock data
        </p>
        <p className="text-green-700">
          Total Mock Products: <strong>{totalProducts}</strong>
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Navigation Links */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">🔗 Test Navigation</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/admin/products" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Admin Products Page
          </a>
          <a href="/admin/products/add" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            Add Product Page
          </a>
          <a href="/test-api" className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">
            API Test Page
          </a>
          <a href="/admin/dashboard" className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600">
            Admin Dashboard
          </a>
        </div>
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl font-bold mb-4">Mock Products Data</h2>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Brand: <strong>{product.brand.name}</strong> |
                    Category: <strong>{product.category.name}</strong>
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-blue-600 font-semibold">
                      {formatUsdPrice(product.price)}
                    </span>
                    <span className="text-green-600 font-semibold">
                      {convertAndFormatPrice(product.price)}
                    </span>
                    {product.price_sale && (
                      <span className="text-red-600 font-semibold">
                        Sale: {formatUsdPrice(parseFloat(String(product.price_sale)))} ({convertAndFormatPrice(parseFloat(String(product.price_sale)))})
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stockStatus === 'En stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockStatus} ({product.stockQuantity} units)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Summary */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">🏗️ Architecture Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-700">✅ Working Components:</h4>
            <ul className="list-disc ml-6 text-green-600">
              <li>Admin app running on port 3061</li>
              <li>Currency conversion (USD → Guaraní)</li>
              <li>API service layer structure</li>
              <li>Product CRUD operations (mock)</li>
              <li>TypeScript interfaces</li>
              <li>Pagination and filtering</li>
              <li>Real-time UI updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-700">⚠️ Issues Found:</h4>
            <ul className="list-disc ml-6 text-orange-600">
              <li>Backend database not connected (port 15432)</li>
              <li>PostgreSQL server not running</li>
              <li>Need Docker services for full functionality</li>
              <li>API endpoints returning 500 errors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">🚀 Next Steps to Complete Setup</h3>
        <ol className="list-decimal ml-6 text-blue-700 space-y-1">
          <li>Start PostgreSQL database (Docker or local)</li>
          <li>Run database migrations: <code className="bg-gray-200 px-1 rounded">npm run prisma:migrate:dev</code></li>
          <li>Seed database with products: <code className="bg-gray-200 px-1 rounded">npm run docker:seed</code></li>
          <li>Test live API endpoints</li>
          <li>Verify full functionality</li>
        </ol>
      </div>
    </div>
  );
}
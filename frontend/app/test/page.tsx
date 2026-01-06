'use client';

import { useState, useEffect } from 'react';
import { ClubDeOfertasProduct } from '../../types';
import { productsApi, convertToClubDeOfertasProduct } from '../../lib/products-api';

export default function TestPage() {
  const [products, setProducts] = useState<ClubDeOfertasProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestProducts = async () => {
      console.log('TestPage component rendering...');

      try {
        setLoading(true);
        setError(null);

        // Fetch 24 products for testing
        const response = await productsApi.getProducts({
          page: 1,
          limit: 24,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        // Convert API products to frontend format
        const convertedProducts = response.products.map(convertToClubDeOfertasProduct);
        setProducts(convertedProducts);
        setTotal(response.pagination.total);

        console.log(`Products fetched: ${convertedProducts.length}`);
        console.log(`Total available: ${response.pagination.total}`);

      } catch (err) {
        console.error('Error in TestPage:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTestProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Test Page - Products Loading</h1>
        <div className="bg-blue-100 border border-blue-400 rounded p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Loading products from API...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Products</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page - Products Loading</h1>
      <p className="mb-4">Total products available: {total}</p>
      <p className="mb-8">Showing {products.length} products</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-sm text-gray-500 mb-2">Brand: {product.brand_name || 'N/A'}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                ${product.price}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${
                product.stockStatus === 'Em estoque'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stockStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
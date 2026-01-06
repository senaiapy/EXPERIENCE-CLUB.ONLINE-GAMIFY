'use client';

import { useState, useEffect } from 'react';
import { productsApi, Product } from '../../lib/products-api';
import { convertAndFormatPrice, formatUsdPrice } from '../../lib/currency';

export default function TestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products from API...');
      const response = await productsApi.getProducts({
        page: 1,
        limit: 24,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      setProducts(response.products);
      setTotal(response.pagination.total);
      console.log(`Loaded ${response.products.length} products from API`);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Test Page - Loading Products...</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Products</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page - Products from API</h1>
      <p className="mb-4">Total products in database: {total}</p>
      <p className="mb-8">Showing {products.length} products</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const imageUrl = (product.images && product.images.find(img => img.size === 'HOME')?.url) ||
                         (product.images && product.images.find(img => img.size === 'SMALL')?.url) ||
                         (product.images && product.images[0]?.url) ||
                         product.image_name ||
                         '/images/no-image.jpg';

          return (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/no-image.jpg';
                }}
              />
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
              <p className="text-sm text-gray-500 mb-2">Brand: {product.brand.name}</p>
              <div className="flex flex-col gap-1 mb-2">
                <span className="text-sm text-gray-500">
                  {formatUsdPrice(parseFloat(String(product.price_sale || product.price)))}
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {convertAndFormatPrice(parseFloat(String(product.price_sale || product.price)))}
                </span>
              </div>
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                product.stockStatus === 'En stock' || parseFloat(String(product.stockQuantity || 0)) > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stockStatus} ({product.stockQuantity} units)
              </span>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
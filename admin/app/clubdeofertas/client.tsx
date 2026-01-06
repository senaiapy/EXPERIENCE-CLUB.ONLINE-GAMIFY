'use client';

import { useState, useMemo } from 'react';
import { ClubDeOfertasProduct } from '@/types';
import Image from 'next/image';

interface ClientComponentProps {
  initialProducts: ClubDeOfertasProduct[];
}

// Function to format price
function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numPrice);
}

// Format price in Guarani (7,500 Gs = 1 USD)
function formatGuaraniPrice(price: string): string {
  const usdPrice = parseFloat(price);
  if (isNaN(usdPrice)) return 'N/A';
  const guaraniPrice = usdPrice * 7500;
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(guaraniPrice) + ' Gs';
}

export default function ClientComponent({ initialProducts }: ClientComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get unique categories and brands
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialProducts.map(p => p.category))).filter(Boolean);
    return cats.sort();
  }, [initialProducts]);

  const brands = useMemo(() => {
    const brandSet = Array.from(new Set(initialProducts.map(p => p.brand_name))).filter(b => b && b !== 'N/A');
    return brandSet.sort();
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand_name === selectedBrand);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return parseInt(a.price || '0') - parseInt(b.price || '0');
        case 'price_high':
          return parseInt(b.price || '0') - parseInt(a.price || '0');
        case 'brand':
          return a.brand_name.localeCompare(b.brand_name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [initialProducts, searchTerm, selectedCategory, selectedBrand, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar productos
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, marca o tags..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange(() => setSelectedCategory(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => handleFilterChange(() => setSelectedBrand(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las marcas</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Nombre A-Z</option>
              <option value="brand">Marca A-Z</option>
              <option value="price_low">Precio: Menor a Mayor</option>
              <option value="price_high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{currentProducts.length}</span> de{' '}
            <span className="font-semibold">{filteredProducts.length}</span> productos
            {searchTerm || selectedCategory || selectedBrand ? ' filtrados' : ''}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                {product.images && product.images !== 'N/A' ? (
                  <img
                    src={`/images/${product.images}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stockStatus === 'Em estoque'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockStatus}
                  </span>
                </div>

                {/* Brand Badge */}
                {product.brand_name && product.brand_name !== 'N/A' && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {product.brand_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-2">
                  <span className="text-sm text-purple-600 font-medium">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mb-3">
                  {product.price !== 'N/A' ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPrice(product.price_sale)}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice((parseFloat(product.price_sale) * 1.1).toString())}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {formatGuaraniPrice(product.price_sale)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">Consultar precio</div>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags !== 'N/A' && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {product.tags.split(';').slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product ID */}
                <div className="text-xs text-gray-400 mb-3">
                  ID: {product.id}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-300 mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {/* Previous Button */}
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              ← Anterior
            </button>
          )}

          {/* Page Numbers */}
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const pageNumber = Math.max(1, currentPage - 5) + i;
            if (pageNumber > totalPages) return null;
            
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                  pageNumber === currentPage
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Siguiente →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
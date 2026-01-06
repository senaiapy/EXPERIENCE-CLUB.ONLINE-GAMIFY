'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClubDeOfertasProduct } from '../../types';
import { productsApi, convertToClubDeOfertasProduct } from '../../lib/products-api';
import ProductCard from '../../components/ProductCard';
import UrlPagination from '../../components/UrlPagination';

interface ProductsData {
  products: ClubDeOfertasProduct[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

const ClubDeOfertasClient: React.FC = () => {
  const searchParams = useSearchParams();
  const [productsData, setProductsData] = useState<ProductsData>({
    products: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 24;

  const totalPages = Math.ceil(productsData.total / limit);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsData(prev => ({ ...prev, isLoading: true, error: null }));

        console.log(`Loading Experience Club products from API for page ${page}...`);

        const apiResponse = await productsApi.getProducts({
          page,
          limit,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        // Convert API products to ClubDeOfertasProduct format
        const products = apiResponse.products.map(convertToClubDeOfertasProduct);

        console.log(`Loaded ${products.length} Experience Club products from API`);

        setProductsData({
          products,
          total: apiResponse.pagination.total,
          isLoading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading Experience Club products from API:', error);
        setProductsData({
          products: [],
          total: 0,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    };

    loadProducts();
  }, [page]);

  if (productsData.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Products</h1>
          <p className="text-red-500 mb-4">{productsData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Experience Club</h1>
            <p className="text-xl opacity-90 mb-8">Perfumes exclusivos con los mejores precios</p>

            <div className="flex justify-center items-center">
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
                <span className="text-2xl font-bold">Total de productos</span>
                <div className="text-3xl font-bold mt-2">
                  {productsData.isLoading ? 'Cargando...' : productsData.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <a href="/categorias/perfumes-masculinos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Perfumes Masculinos
            </a>
            <a href="/categorias/perfumes-femeninos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Perfumes Femeninos
            </a>
            <a href="/categorias/perfumes-arabes-masculinos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Árabes Masculinos
            </a>
            <a href="/categorias/perfumes-arabes-femeninos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Árabes Femeninos
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Info */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Todos los Productos
            <span className="text-gray-500 text-lg font-normal ml-2">
              (Página {page} de {totalPages})
            </span>
          </h2>
          <div className="text-sm text-gray-600">
            {productsData.isLoading ? 'Cargando...' : `Mostrando ${productsData.products.length} de ${productsData.total} productos`}
          </div>
        </div>

        {/* Products Grid */}
        {productsData.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        ) : productsData.products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Component */}
            <UrlPagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/clubdeofertas"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full p-6 mb-6 inline-block">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-500">
                Los productos se están cargando desde Experience Club...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Experience Club</h3>
              <p className="text-gray-400">
                Los mejores perfumes y fragancias con precios exclusivos para nuestros miembros.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2">
                <li><a href="/categorias/perfumes-masculinos" className="text-gray-400 hover:text-white">Perfumes Masculinos</a></li>
                <li><a href="/categorias/perfumes-femeninos" className="text-gray-400 hover:text-white">Perfumes Femeninos</a></li>
                <li><a href="/categorias/perfumes-arabes-masculinos" className="text-gray-400 hover:text-white">Árabes Masculinos</a></li>
                <li><a href="/categorias/perfumes-arabes-femeninos" className="text-gray-400 hover:text-white">Árabes Femeninos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400 mb-2">
                ¿Tienes preguntas? Contáctanos
              </p>
              <p className="text-gray-400">
                info@experienceclub.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400">
              © 2025 Experience Club. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClubDeOfertasClient;
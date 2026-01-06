'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClubDeOfertasProduct } from '../../types';
import { productsApi, convertToClubDeOfertasProduct } from '../../lib/products-api';
import ProductCard from '../../components/ProductCard';
import Carousel from '../../components/Carousel';
import UrlPagination from '../../components/UrlPagination';

interface ProductsData {
  products: ClubDeOfertasProduct[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface HomeClientProps {
  basePath?: string;
}

const HomeClient: React.FC<HomeClientProps> = ({ basePath = '/' }) => {
  const searchParams = useSearchParams();
  const [productsData, setProductsData] = useState<ProductsData>({
    products: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const limit = 24;

  const totalPages = Math.ceil(productsData.total / limit);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsData(prev => ({ ...prev, isLoading: true, error: null }));

        console.log(`Loading products from API for page ${page}${searchQuery ? ` with search: "${searchQuery}"` : ''}...`);

        let apiResponse;

        if (searchQuery && searchQuery.trim()) {
          // Use search API endpoint
          apiResponse = await productsApi.searchProducts(searchQuery.trim(), {
            page,
            limit,
            sortBy: 'name',
            sortOrder: 'asc'
          });
          console.log(`Found ${apiResponse.pagination.total} products matching "${searchQuery}"`);
        } else {
          // Use regular products API endpoint
          apiResponse = await productsApi.getProducts({
            page,
            limit,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
        }

        // Convert API products to ClubDeOfertasProduct format
        const products = apiResponse.products.map(convertToClubDeOfertasProduct);

        console.log(`Loaded ${products.length} products from API`);

        setProductsData({
          products,
          total: apiResponse.pagination.total,
          isLoading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading products from API:', error);
        setProductsData({
          products: [],
          total: 0,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    };

    loadProducts();
  }, [page, searchQuery]);

  if (productsData.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Erro ao Carregar Produtos</h1>
          <p className="text-red-500 mb-4">{productsData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main>
        {/* Hero Section - Hide when searching */}
        {!searchQuery && (
          <>
            <section className="relative bg-gradient-to-r from-emerald-400 to-emerald-600 py-10 md:py-14">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Descubra Seu Estilo</h1>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">Novos Lançamentos, Preços Imbatíveis</p>
                <a
                  href="#produtos"
                  className="inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                >
                  Comprar Agora
                </a>
              </div>
            </section>

            {/* Carousel Section */}
            <section className="container mx-auto px-4 py-12">
              <Carousel />
            </section>

            {/* Category Filters */}
            <section className="container mx-auto px-4 py-10">
              <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">Comprar por Categoria</h2>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-lg border border-emerald-200">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <a
                    href={`${basePath}?search=Apple`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🍎
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Apple</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Bebidas`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🍹
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Bebidas</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Beleza e Perfumaria`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      💄
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Beleza e Perfumaria</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Brinquedos`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🧸
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Brinquedos</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Casa`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🏠
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Casa</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Cozinha`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🍳
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Cozinha</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Eletrônicos`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      📱
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Eletrônicos</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Informática`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      💻
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Informática</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Perfumes Femeninos`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🌸
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Perfumes Femeninos</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Perfumes Masculinos`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🎩
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Perfumes Masculinos</h3>
                  </a>
                  <a
                    href={`${basePath}?search=Shop`}
                    className="group relative bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200 hover:border-emerald-500"
                  >
                    <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🛍️
                    </div>
                    <h3 className="text-center font-semibold text-gray-700 group-hover:text-emerald-600">Shop</h3>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Products Grid */}
        <section id="productos" className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Produtos em Destaque'}
              </h2>
              {searchQuery && (
                <a
                  href={basePath}
                  className="inline-block mt-2 text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  ← Volver a todos los productos
                </a>
              )}
            </div>
            <p className="text-gray-600">
              {productsData.isLoading ? 'Carregando...' : `Total: ${productsData.total.toLocaleString()} produtos`}
            </p>
          </div>

          {productsData.isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
            </div>
          ) : productsData.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productsData.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* New Pagination Component */}
              <UrlPagination
                currentPage={page}
                totalPages={totalPages}
                searchQuery={searchQuery}
                basePath={basePath}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                {searchQuery ? `Nenhum produto encontrado para "${searchQuery}"` : 'Nenhum produto encontrado'}
              </p>
              {searchQuery && (
                <p className="text-gray-400 mt-2">
                  Tente com termos de busca diferentes
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomeClient;
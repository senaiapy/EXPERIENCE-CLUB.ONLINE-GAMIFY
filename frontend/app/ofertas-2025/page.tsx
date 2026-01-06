import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../components/ProductCard';

async function getOfferProducts(page: number = 1, limit: number = 24): Promise<{ products: ClubDeOfertasProduct[], total: number }> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Filter for offer products (products with significant price differences or sale indicators)
    allProducts = allProducts.filter(product => {
      const buyPrice = parseFloat(product.price) || 0;
      const sellPrice = parseFloat(product.price_sale) || 0;
      const discount = sellPrice > buyPrice ? ((sellPrice - buyPrice) / sellPrice) * 100 : 0;

      // Include products with at least 10% discount or containing offer-related keywords
      const hasDiscount = discount > 10;
      const hasOfferKeywords = product.tags?.toLowerCase().includes('oferta') ||
                               product.name?.toLowerCase().includes('oferta') ||
                               product.description?.toLowerCase().includes('descuento') ||
                               product.tags?.toLowerCase().includes('promocion');
      
      return hasDiscount || hasOfferKeywords || Math.random() > 0.7; // Include some random products for variety
    });
    
    const totalProducts = allProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);
    
    return { products, total: totalProducts };
  } catch (error) {
    console.error('Error loading offer products:', error);
    return { products: [], total: 0 };
  }
}

export default async function Ofertas2025Page({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;
  
  const { products, total } = await getOfferProducts(page, limit);
  const totalPages = Math.ceil(total / limit);
  
  const buildUrl = (pageNum: number) => {
    return `/ofertas-2025${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-white text-red-500 px-4 py-2 rounded-full text-xl font-bold animate-pulse">
                🔥 OFERTAS 2025 🔥
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ofertas Especiales 2025
            </h1>
            <p className="text-pink-100 text-lg mb-6">
              Los mejores descuentos del año - ¡No te los pierdas!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="text-white font-semibold">{total} productos en oferta</span>
              </div>
              <div className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold">
                Hasta 50% OFF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Benefits */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Descuentos Increíbles</h3>
              <p className="text-gray-600">Hasta 50% de descuento en productos seleccionados</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En todas las compras durante las ofertas 2025</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Productos Originales</h3>
              <p className="text-gray-600">Garantía de autenticidad en todos nuestros productos</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <>
            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Productos en Oferta
              </h2>
              <div className="flex items-center space-x-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  ¡Tiempo limitado!
                </span>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Ordenar por descuento</option>
                  <option>Precio: menor a mayor</option>
                  <option>Precio: mayor a menor</option>
                  <option>Más vendidos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  {/* Offer Badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                      OFERTA
                    </div>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2 items-center">
                  {page > 1 && (
                    <>
                      <a 
                        href={buildUrl(1)} 
                        className="px-4 py-2 bg-red-500 text-white border border-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
                      >
                        INICIO
                      </a>
                      <a 
                        href={buildUrl(page - 1)} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Anterior
                      </a>
                    </>
                  )}
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = Math.max(1, Math.min(page - 2 + index, totalPages - 4)) + index;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <a
                        key={pageNum}
                        href={buildUrl(pageNum)}
                        className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                          pageNum === page
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                  
                  {page < totalPages && (
                    <>
                      <a 
                        href={buildUrl(page + 1)} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Siguiente
                      </a>
                      <a 
                        href={buildUrl(totalPages)} 
                        className="px-4 py-2 bg-red-500 text-white border border-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
                      >
                        FINAL
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay ofertas disponibles en este momento
            </h2>
            <p className="text-gray-500">
              Vuelve pronto para ver las nuevas ofertas 2025
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-lg mb-6 text-purple-100">
            Explora todo nuestro catálogo y encuentra el producto perfecto para ti
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver todos los productos
          </a>
        </div>
      </main>
    </div>
  );
}
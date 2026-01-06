import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../components/ProductCard';

async function getTopProducts(page: number = 1, limit: number = 24): Promise<{ products: ClubDeOfertasProduct[], total: number }> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Filter for top products based on different criteria
    allProducts = allProducts.filter(product => {
      const buyPrice = parseFloat(product.price) || 0;
      const sellPrice = parseFloat(product.price_sale) || 0;
      const hasCompetitivePrice = buyPrice > 30 && sellPrice > 50; // Higher price range products

      // Include premium brands or popular keywords
      const premiumKeywords = ['dior', 'chanel', 'versace', 'gucci', 'prada', 'armani', 'hugo boss', 'tom ford', 'dolce', 'calvin klein', 'polo', 'lacoste', 'burberry', 'carolina herrera'];
      const hasPremiumBrand = premiumKeywords.some(keyword =>
        product.name?.toLowerCase().includes(keyword) ||
        product.brand_name?.toLowerCase().includes(keyword) ||
        product.tags?.toLowerCase().includes(keyword)
      );

      // Include products with good availability
      const hasGoodAvailability = product.stockStatus?.toLowerCase().includes('disponivel') ||
                                 product.stockStatus?.toLowerCase().includes('estoque') ||
                                 product.stockStatus?.toLowerCase().includes('stock');
      
      return hasCompetitivePrice && (hasPremiumBrand || hasGoodAvailability);
    });
    
    // Sort by price (higher prices first) for premium feel
    allProducts.sort((a, b) => {
      const priceA = parseFloat(a.price_sale) || 0;
      const priceB = parseFloat(b.price_sale) || 0;
      return priceB - priceA;
    });
    
    const totalProducts = allProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);
    
    return { products, total: totalProducts };
  } catch (error) {
    console.error('Error loading top products:', error);
    return { products: [], total: 0 };
  }
}

export default async function TopDestacadosPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;
  
  const { products, total } = await getTopProducts(page, limit);
  const totalPages = Math.ceil(total / limit);
  
  const buildUrl = (pageNum: number) => {
    return `/top-destacados${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-white text-yellow-600 px-4 py-2 rounded-full text-xl font-bold animate-pulse">
                ⭐ TOP DESTACADOS ⭐
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Productos Más Destacados
            </h1>
            <p className="text-yellow-100 text-lg mb-6">
              Nuestra selección premium de perfumes y productos de belleza más populares
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="text-white font-semibold">{total} productos destacados</span>
              </div>
              <div className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold">
                Calidad Premium
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Marcas Premium</h3>
              <p className="text-gray-600">Las mejores marcas internacionales</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">100% Originales</h3>
              <p className="text-gray-600">Garantía de autenticidad</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Más Vendidos</h3>
              <p className="text-gray-600">Productos con mayor demanda</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Alta Calidad</h3>
              <p className="text-gray-600">Solo lo mejor para ti</p>
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
                Productos Destacados
              </h2>
              <div className="flex items-center space-x-4">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  ⭐ Premium Selection
                </span>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Precio: mayor a menor</option>
                  <option>Precio: menor a mayor</option>
                  <option>Más populares</option>
                  <option>Mejor valorados</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="relative">
                  {/* Top Products Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        TOP {index + 1}
                      </div>
                    </div>
                  )}
                  {/* Premium Badge for high-end products */}
                  {index >= 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                        PREMIUM
                      </div>
                    </div>
                  )}
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
                        className="px-4 py-2 bg-yellow-500 text-white border border-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
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
                            ? 'bg-yellow-500 text-white border-yellow-500'
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
                        className="px-4 py-2 bg-yellow-500 text-white border border-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
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
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Cargando productos destacados...
            </h2>
            <p className="text-gray-500">
              Estamos preparando nuestra selección premium para ti
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¿Buscas algo específico?</h2>
          <p className="text-lg mb-6 text-yellow-100">
            Explora nuestro catálogo completo y encuentra el producto perfecto
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/" 
              className="inline-block bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Todos los Productos
            </a>
            <a 
              href="/ofertas-2025" 
              className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Ver Ofertas 2025
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
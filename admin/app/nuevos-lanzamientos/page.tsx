import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../components/ProductCard';

async function getNewProducts(page: number = 1, limit: number = 24): Promise<{ products: ClubDeOfertasProduct[], total: number }> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Filter for new launches based on different criteria
    allProducts = allProducts.filter(product => {
      // Look for keywords that suggest new products
      const newKeywords = ['novo', 'nuevo', 'new', 'lanzamiento', '2025', '2024', 'limited', 'edition', 'exclusivo', 'recente'];
      const hasNewKeywords = newKeywords.some(keyword =>
        product.name?.toLowerCase().includes(keyword) ||
        product.tags?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword)
      );
      
      // Include products with good availability (suggesting they're recently stocked)
      const hasGoodAvailability = product.stockStatus?.toLowerCase().includes('disponivel') ||
                                 product.stockStatus?.toLowerCase().includes('estoque') ||
                                 product.stockStatus?.toLowerCase().includes('stock');
      
      // Include modern/trendy brands
      const trendyBrands = ['versace', 'dolce', 'prada', 'armani', 'hugo', 'calvin', 'tom ford', 'carolina herrera', 'dior', 'chanel'];
      const hasTrendyBrand = trendyBrands.some(brand =>
        product.name?.toLowerCase().includes(brand) ||
        product.brand_name?.toLowerCase().includes(brand)
      );
      
      // Prefer products with interesting descriptions or complete information
      const hasCompleteInfo = product.description && product.description.length > 20;
      
      return (hasNewKeywords || (hasTrendyBrand && hasGoodAvailability && hasCompleteInfo)) || Math.random() > 0.85;
    });
    
    // Shuffle to simulate "recently added" randomness, then sort by some criteria
    allProducts = allProducts.sort(() => Math.random() - 0.5).slice(0, Math.min(allProducts.length, 200));
    
    const totalProducts = allProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);
    
    return { products, total: totalProducts };
  } catch (error) {
    console.error('Error loading new products:', error);
    return { products: [], total: 0 };
  }
}

export default async function NuevosLanzamientosPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;
  
  const { products, total } = await getNewProducts(page, limit);
  const totalPages = Math.ceil(total / limit);
  
  const buildUrl = (pageNum: number) => {
    return `/nuevos-lanzamientos${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-white text-purple-600 px-4 py-2 rounded-full text-xl font-bold animate-pulse">
                🆕 NUEVOS LANZAMIENTOS 🆕
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Últimos Lanzamientos 2025
            </h1>
            <p className="text-purple-100 text-lg mb-6">
              Descubre las últimas novedades en perfumes y productos de belleza
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="text-white font-semibold">{total} productos nuevos</span>
              </div>
              <div className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold">
                Recién Llegados
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
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Últimas Tendencias</h3>
              <p className="text-gray-600">Los productos más innovadores del mercado</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Recién Llegados</h3>
              <p className="text-gray-600">Productos que acaban de llegar a nuestro stock</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Ediciones Limitadas</h3>
              <p className="text-gray-600">Productos exclusivos de disponibilidad limitada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">100% originales con garantía de autenticidad</p>
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
                Nuevos Lanzamientos
              </h2>
              <div className="flex items-center space-x-4">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  🆕 Recién llegados
                </span>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Más recientes primero</option>
                  <option>Precio: menor a mayor</option>
                  <option>Precio: mayor a menor</option>
                  <option>Alfabético</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="relative">
                  {/* New Badge */}
                  {index < 8 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 3l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L13 3z"/>
                        </svg>
                        NUEVO
                      </div>
                    </div>
                  )}
                  {/* Limited Edition Badge for some products */}
                  {index >= 8 && index < 16 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                        LIMITADO
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
                        className="px-4 py-2 bg-purple-500 text-white border border-purple-500 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-semibold"
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
                            ? 'bg-purple-500 text-white border-purple-500'
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
                        className="px-4 py-2 bg-purple-500 text-white border border-purple-500 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-semibold"
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
            <div className="text-6xl mb-4">🆕</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Cargando nuevos lanzamientos...
            </h2>
            <p className="text-gray-500">
              Estamos preparando las últimas novedades para ti
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">¡No te pierdas las novedades!</h2>
          <p className="text-lg mb-6 text-purple-100">
            Suscríbete a nuestro newsletter y sé el primero en conocer los nuevos lanzamientos
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Tu email aquí..." 
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Suscribirme
            </button>
          </div>
          <p className="text-purple-200 text-sm mt-4">
            * Al suscribirte, recibirás notificaciones de nuevos productos y ofertas exclusivas
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-white rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Explora Más Productos</h2>
          <p className="text-gray-600 mb-6">
            Descubre todo nuestro catálogo de perfumes y productos de belleza
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Ver Todos los Productos
            </a>
            <a 
              href="/top-destacados" 
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Top Destacados
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
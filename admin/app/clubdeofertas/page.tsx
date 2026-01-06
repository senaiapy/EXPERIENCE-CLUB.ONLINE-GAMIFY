import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

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

// Function to read Experience Club products with pagination
async function getClubDeOfertasProducts(
  page: number = 1, 
  limit: number = 12
): Promise<{ products: ClubDeOfertasProduct[], total: number, totalPages: number }> {
  try {
    // Read from JSON file
    const jsonPath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(jsonPath, 'utf8');
    const allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Pagination
    const total = allProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);
    
    return { products, total, totalPages };
  } catch (error) {
    console.error('Error reading Experience Club products:', error);
    return { products: [], total: 0, totalPages: 0 };
  }
}

// Main page component
export default async function ClubDeOfertasPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1');
  const { products, total, totalPages } = await getClubDeOfertasProducts(currentPage, 12);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                <span className="text-purple-600">Club</span> de{' '}
                <span className="text-pink-600">Ofertas</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Perfumes exclusivos con los mejores precios
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total de productos</p>
              <p className="text-2xl font-bold text-purple-600">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <Link 
              href="/clubdeofertas?categoria=Perfumes%20Masculinos"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Perfumes Masculinos
            </Link>
            <Link 
              href="/clubdeofertas?categoria=Perfumes%20Femeninos"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Perfumes Femeninos
            </Link>
            <Link 
              href="/clubdeofertas?categoria=Perfumes%20Árabes%20Masculinos"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Árabes Masculinos
            </Link>
            <Link 
              href="/clubdeofertas?categoria=Perfumes%20Árabes%20Femeninos"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Árabes Femeninos
            </Link>
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
              (Página {currentPage} de {totalPages})
            </span>
          </h2>
          <div className="text-sm text-gray-600">
            Mostrando {products.length} de {total} productos
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {product.images && product.images !== 'N/A' ? (
                    <img
                      src={`/clubdeofertas_images/${product.images}`}
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
                      product.stockStatus === 'Disponible'
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
                        {product.price !== product.price_sale && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
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
            <div className="text-6xl text-gray-300 mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-500">
              Los productos se están cargando desde Experience Club...
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={`/clubdeofertas?page=${currentPage - 1}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                ← Anterior
              </Link>
            )}

            {/* Page Numbers */}
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, currentPage - 5) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Link
                  key={pageNumber}
                  href={`/clubdeofertas?page=${pageNumber}`}
                  className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                    pageNumber === currentPage
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/clubdeofertas?page=${currentPage + 1}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Siguiente →
              </Link>
            )}
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
                Los mejores perfumes con precios exclusivos para nuestros clientes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categorías</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Perfumes Masculinos</li>
                <li>Perfumes Femeninos</li>
                <li>Perfumes Árabes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400">
                WhatsApp: +595 991 474601
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Experience Club. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
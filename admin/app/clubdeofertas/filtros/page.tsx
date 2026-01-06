'use client';

import { useState, useEffect } from 'react';
import { productsApi, Product, convertToClubDeOfertasProduct } from '@/lib/products-api';
import ClientComponent from '../client';

export default function ClubDeOfertasFiltrosPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading all products from API...');
      // Fetch all products with large limit
      const response = await productsApi.getProducts({
        page: 1,
        limit: 5000, // Get all products
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      // Convert API products to legacy format for ClientComponent
      const legacyProducts = response.products.map(convertToClubDeOfertasProduct);
      setAllProducts(legacyProducts);
      console.log(`Loaded ${legacyProducts.length} products from API`);
    } catch (error) {
      console.error('Error loading products:', error);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }
  
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
                Explora y filtra todos nuestros productos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total de productos</p>
              <p className="text-2xl font-bold text-purple-600">{allProducts.length.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <a 
              href="/clubdeofertas"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              ← Volver a Vista Simple
            </a>
            <span className="text-purple-600 font-medium">
              Vista con Filtros Avanzados
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientComponent initialProducts={allProducts} />
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
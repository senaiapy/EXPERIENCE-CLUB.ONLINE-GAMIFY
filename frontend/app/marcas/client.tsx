'use client';

import { useState, useEffect, useMemo } from 'react';

interface BrandProduct {
  id: string;
  name: string;
  descripcion: string;
  buy_price: string;
  sell_price: string;
  marca: string;
  categoria_marca: string;
  ref: string;
  disponibilidad: string;
  main_image: string;
  additional_images: string;
  categorias: string;
  tags: string;
}

export default function MarcasClient({ initialProducts, total, page, limit }: { initialProducts: BrandProduct[], total: number, page: number, limit: number }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  // Extract unique brands and categories for filters
  const brands = useMemo(() => {
    return Array.from(new Set(initialProducts.map(product => product.marca)));
  }, [initialProducts]);

  const categories = useMemo(() => {
    return Array.from(new Set(initialProducts.map(product => product.categoria_marca)));
  }, [initialProducts]);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.marca && product.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.categoria_marca && product.categoria_marca.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand = !brandFilter || product.marca === brandFilter;
      
      const matchesCategory = !categoryFilter || product.categoria_marca === categoryFilter;
      
      const matchesAvailability = !availabilityFilter || product.disponibilidad === availabilityFilter;
      
      let matchesPrice = true;
      if (priceFilter) {
        const price = parseFloat(product.sell_price) || 0;
        switch (priceFilter) {
          case '0-200000':
            matchesPrice = price >= 0 && price <= 200000;
            break;
          case '200000-500000':
            matchesPrice = price > 200000 && price <= 500000;
            break;
          case '500000-1000000':
            matchesPrice = price > 500000 && price <= 1000000;
            break;
          case '1000000+':
            matchesPrice = price > 1000000;
            break;
        }
      }
      
      return matchesSearch && matchesBrand && matchesCategory && matchesPrice && matchesAvailability;
    });
  }, [initialProducts, searchTerm, brandFilter, categoryFilter, priceFilter, availabilityFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(total / limit);

  // Format price in USD
  const formatPrice = (price: string) => {
    const num = parseFloat(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  // Product Card Component for brand-specific products
  const BrandProductCard = ({ product }: { product: BrandProduct }) => {
    // Split additional images by semicolon
    const additionalImages = product.additional_images 
      ? product.additional_images.split(';').map(img => img.trim()).filter(img => img) 
      : [];
    
    const [mainImageSrc, setMainImageSrc] = useState(`/images_marcas/${product.main_image}`);
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Imagen no disponible</div>';
    };
    
    const changeMainImage = (newImageSrc: string) => {
      setMainImageSrc(`/images_marcas/${newImageSrc}`);
    };
    
    return (
      <div className="product-card group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Product ID */}
        <div className="product-id bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-br-lg absolute top-0 left-0 z-10">
          ID: {product.id}
        </div>
        
        {/* Product Image */}
        <div className="product-image relative aspect-square overflow-hidden">
          {product.main_image ? (
            <img 
              src={mainImageSrc}
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              Imagen no disponible
            </div>
          )}
        </div>
        
        {/* Additional Images */}
        {additionalImages.length > 0 && (
          <div className="additional-images flex gap-1 p-2">
            {additionalImages.map((img, index) => (
              <img 
                key={index}
                src={`/images_marcas/${img}`} 
                alt={`Imagen adicional ${index + 1}`}
                className="additional-image w-10 h-10 object-cover rounded cursor-pointer border border-gray-200 hover:border-emerald-300 transition-colors"
                onClick={() => changeMainImage(img)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
        
        {/* Product Info */}
        <div className="p-4">
          <h3 className="product-name font-bold text-lg mb-1 truncate">{product.name}</h3>
          
          {/* Reference */}
          <div className="product-ref text-xs text-gray-500 mb-2">
            REF: {product.ref}
          </div>
          
          {/* Brand and Category Info */}
          <div className="brand-info flex flex-wrap gap-2 mb-3">
            {product.marca && product.marca !== 'N/A' && (
              <span className="product-marca bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                🏷️ {product.marca}
              </span>
            )}
            {product.categoria_marca && product.categoria_marca !== 'N/A' && (
              <span className="product-categoria-marca bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                📂 {product.categoria_marca}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="product-description text-gray-600 text-sm mb-3 line-clamp-3">
            {product.descripcion}
          </p>
          
          {/* Price */}
          <div className="product-price flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Compra</span>
              <span className="buy-price text-green-600 font-bold">
                {formatPrice(product.buy_price)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Venta</span>
              <span className="sell-price text-amber-600 font-bold">
                {formatPrice(product.sell_price)}
              </span>
            </div>
          </div>
          
          {/* Availability */}
          <div className="product-status mb-3">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              product.disponibilidad === 'Disponible' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.disponibilidad}
            </span>
          </div>
          
          {/* Categories and Tags */}
          <div className="product-details text-xs text-gray-500 space-y-1">
            <div><strong>Categorías:</strong> {product.categorias}</div>
            <div><strong>Tags:</strong> {product.tags}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Filters Section */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input 
              type="text" 
              placeholder="Buscar productos o marcas..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="">Todas las Marcas</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las Categorías</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">Todos los Precios</option>
              <option value="0-200000">$0 - $200</option>
              <option value="200000-500000">$200 - $500</option>
              <option value="500000-1000000">$500 - $1,000</option>
              <option value="1000000+">$1,000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="">Todas las Disponibilidades</option>
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Productos por Marcas <span className="text-gray-500 text-lg">({total} productos)</span>
          </h2>
          <div className="text-gray-600">
            Mostrando {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} de {total} productos
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <BrandProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con los filtros.</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {page > 1 && (
                <a 
                  href={`/marcas?page=${page - 1}`} 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Anterior
                </a>
              )}
              
              {/* Show first page */}
              {page > 3 && (
                <>
                  <a 
                    href="/marcas?page=1" 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    1
                  </a>
                  {page > 4 && (
                    <span className="px-4 py-2 text-gray-500">...</span>
                  )}
                </>
              )}
              
              {/* Show pages around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <a 
                    key={pageNum}
                    href={`/marcas?page=${pageNum}`} 
                    className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                      pageNum === page 
                        ? 'bg-emerald-500 text-white border-emerald-500' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
              
              {/* Show last page */}
              {page < totalPages - 2 && (
                <>
                  {page < totalPages - 3 && (
                    <span className="px-4 py-2 text-gray-500">...</span>
                  )}
                  <a 
                    href={`/marcas?page=${totalPages}`} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {totalPages}
                  </a>
                </>
              )}
              
              {page < totalPages && (
                <a 
                  href={`/marcas?page=${page + 1}`} 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
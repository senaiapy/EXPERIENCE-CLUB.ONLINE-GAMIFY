'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../../components/ProductCard';

interface ProductDetailClientProps {
  product: ClubDeOfertasProduct;
  relatedProducts: ClubDeOfertasProduct[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numPrice);
  };

  // Format price in Guarani (7,500 Gs = 1 USD)
  const formatGuaraniPrice = (price: string) => {
    const usdPrice = parseFloat(price) || 0;
    const guaraniPrice = usdPrice * 7500;
    return new Intl.NumberFormat('es-PY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(guaraniPrice) + ' Gs';
  };

  // Format price in Brazilian Real (5.5 BRL = 1 USD)
  const formatBrazilianPrice = (price: string) => {
    const usdPrice = parseFloat(price) || 0;
    const brlPrice = usdPrice * 5.5;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(brlPrice);
  };

  const calculateDiscount = () => {
    const sellPrice = parseFloat(product.price_sale) || 0;
    const originalPrice = sellPrice * 1.1; // Original price is 10% more than sale price
    if (originalPrice > sellPrice) {
      return Math.round(((originalPrice - sellPrice) / originalPrice) * 100);
    }
    return 10; // Default 10% discount
  };

  const addToCart = () => {
    try {
      const existingCart = localStorage.getItem('cart');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price_sale,
          image: product.images,
          brand: product.brand_name,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated', { detail: { count: cartItems.length } });
      window.dispatchEvent(event);
      
      alert(`${product.name} agregado al carrito (${quantity} unidad${quantity > 1 ? 'es' : ''})`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    }
  };

  const buyNow = () => {
    addToCart();
    window.location.href = '/checkout';
  };

  const isAvailable = () => {
    const availability = product.stockStatus?.toLowerCase() || '';
    return availability.includes('disponivel') || 
           availability.includes('estoque') || 
           availability.includes('stock') ||
           availability.includes('sim') ||
           availability.includes('yes') ||
           availability.includes('available');
  };

  // Mock multiple images for gallery
  const productImages = [
    `/images/${product.images}`,
    `/images/${product.images}`, // Duplicate for demo
    `/images/${product.images}`, // Duplicate for demo
  ];

  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/" className="hover:text-emerald-600">Productos</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name?.substring(0, 50)}...</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-emerald-600 font-medium mb-1">
                  {product.brand_name}
                </p>
                <p className="text-gray-600">
                  REF: {product.referenceId}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-3xl font-bold text-emerald-600">
                    {formatPrice(product.price_sale)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice((parseFloat(product.price_sale) * 1.1).toString())}
                      </span>
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
                
                {/* Additional Currency Prices */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-semibold text-gray-700">
                      {formatGuaraniPrice(product.price_sale)}
                    </span>
                    <span className="text-xl font-semibold text-blue-600">
                      {formatBrazilianPrice(product.price_sale)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">Precio incluye impuestos</p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isAvailable() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${isAvailable() ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable() ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
                {isAvailable() && (
                  <p className="text-sm text-gray-600 mt-1">
                    Listo para envío inmediato
                  </p>
                )}
              </div>

              {/* Quantity and Actions */}
              {isAvailable() && (
                <div className="mb-8">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={addToCart}
                      className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Agregar al Carrito
                    </button>
                    <button
                      onClick={buyNow}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Comprar Ahora
                    </button>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Características</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Producto original
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Garantía de calidad
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Envío gratis
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Devolución gratis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="leading-relaxed">
                {product.description}
              </p>
              {product.specifications && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Especificaciones:</h3>
                  <p>{product.specifications}</p>
                </div>
              )}
              {product.details && product.details !== product.description && (
                <div className="mt-4">
                  <p>{product.details}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
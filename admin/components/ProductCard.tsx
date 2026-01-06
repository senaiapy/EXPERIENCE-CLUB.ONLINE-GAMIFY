'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClubDeOfertasProduct } from '../types';

// Product Card Component
export default function ProductCard({ product }: { product: ClubDeOfertasProduct }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Format price in USD
  const formatPrice = (price: string) => {
    const num = parseFloat(price) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
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
  
  const [imageSrc, setImageSrc] = useState(`/images/${product.images}`);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/placeholder-product.svg'); // Fallback image
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Add to cart clicked for:', product.name);
    console.log('Product availability:', product.stockStatus);

    // Check if product is available (handle different availability text)
    const availability = product.stockStatus?.toLowerCase();
    if (!availability || (!availability.includes('estoque') && !availability.includes('disponible') && !availability.includes('available'))) {
      alert('Este producto no está disponible');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add to cart logic here
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price_sale,
          image: product.images,
          brand: product.brand_name,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setCartCount(cartItems.length);
      
      // Show success message
      const event = new CustomEvent('cartUpdated', { detail: { count: cartItems.length } });
      window.dispatchEvent(event);
      
      // Use a more user-friendly notification
      const productName = product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name;
      alert(`✅ ${productName} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Buy now clicked for:', product.name);

    // Check if product is available (handle different availability text)
    const availability = product.stockStatus?.toLowerCase();
    if (!availability || (!availability.includes('estoque') && !availability.includes('disponible') && !availability.includes('available'))) {
      alert('Este producto no está disponible');
      return;
    }

    // Add to cart first
    setIsAddingToCart(true);
    
    try {
      // Add to cart logic (same as handleAddToCart but without alert)
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price_sale,
          image: product.images,
          brand: product.brand_name,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated', { detail: { count: cartItems.length } });
      window.dispatchEvent(event);
      
      // Then redirect to cart
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Error al procesar la compra');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <Link href={`/product/${product.id}`} className="block group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        {!imageError ? (
          <img 
            src={imageSrc}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            Imagen no disponible
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>

        {/* Quick Action Buttons - Appear on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleBuyNow}
              disabled={isAddingToCart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Procesando...' : 'Comprar Ahora'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Product Name - Main Focus */}
        <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{product.name}</h3>
        
        {/* Brand and Availability Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">{product.brand_name || 'Sin marca'}</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            product.stockStatus === 'Em estoque'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stockStatus === 'Em estoque' ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-500 text-sm line-through">{formatPrice((parseFloat(product.price_sale) * 1.1).toString())}</p>
            <p className="text-emerald-600 font-bold text-xl">{formatPrice(product.price_sale)}</p>
          </div>
          <div className="flex justify-end">
            <p className="text-gray-600 text-sm font-medium">{formatGuaraniPrice(product.price_sale)}</p>
          </div>
        </div>
        
        {/* Mobile Buttons - Always visible on mobile */}
        <div className="flex space-x-2 lg:hidden">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? '...' : 'Agregar'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isAddingToCart}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Comprar
          </button>
        </div>
      </div>
    </Link>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ClubDeOfertasProduct } from '../types';
import { getAvailability, getAvailabilityBadgeClasses } from '../lib/stock-status';
import Toast from './Toast';
import { cartApi } from '@/lib/cart-api';
import { useAuth } from '@/contexts/AuthContext';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';
import { getProductImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

// Product Card Component
export default function ProductCard({ product }: { product: ClubDeOfertasProduct }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const availabilityInfo = getAvailability(product.stockStatus);

  // Prices are already in Guaraníes - display directly without conversion
  const priceInGs = parseFloat(product.price) || 0; // Main price
  const originalPriceInGs = Math.round(priceInGs * 1.1); // Original price = price + 10% (gray strikethrough)

  // Use centralized image utility functions
  const [imageSrc, setImageSrc] = useState(getProductImageUrl(product));
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getPlaceholderUrl());
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setToast({ message: t('productDetail.mustLoginToAddToCart'), type: 'error' });
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    if (!availabilityInfo.isAvailable) {
      setToast({ message: t('productDetail.productNotAvailable'), type: 'error' });
      return;
    }

    setIsAddingToCart(true);

    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: 1
      });

      // Show success message
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);

      const productName = product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name;
      setToast({ message: `${productName} ${t('productDetail.addedToCart')}`, type: 'success' });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setToast({ message: error.response?.data?.message || t('productDetail.errorAddingToCart'), type: 'error' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setToast({ message: t('productDetail.mustLoginToBuy'), type: 'error' });
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    if (!availabilityInfo.isAvailable) {
      setToast({ message: t('productDetail.productNotAvailable'), type: 'error' });
      return;
    }

    setIsAddingToCart(true);

    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: 1
      });

      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);

      // Then redirect to checkout
      router.push('/checkout');
    } catch (error: any) {
      console.error('Error in buy now:', error);
      setToast({ message: error.response?.data?.message || t('productDetail.errorProcessingPurchase'), type: 'error' });
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
            {t('common.imageNotAvailable')}
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Product Name - Main Focus */}
        <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{product.name}</h3>
        
        {/* Brand and Availability Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">{product.brand_name || t('product.brand')}</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityBadgeClasses(availabilityInfo.isAvailable)}`}>
            {availabilityInfo.label}
          </span>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-gray-500 text-sm line-through">
              {formatGuaraniPriceNoDecimals(originalPriceInGs)}
            </p>
          </div>
          <div className="flex justify-end">
            <p className="text-emerald-600 text-2xl font-bold">
              {formatGuaraniPriceNoDecimals(priceInGs)}
            </p>
          </div>
        </div>

        {/* Mobile Buttons - Always visible on mobile */}
        <div className="flex space-x-2 lg:hidden">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? '...' : t('product.add')}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isAddingToCart}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('product.buy')}
          </button>
        </div>
      </div>
    </Link>
    </>
  );
}

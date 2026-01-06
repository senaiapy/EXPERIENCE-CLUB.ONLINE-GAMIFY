'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../components/ProtectedRoute';
import { wishlistApi, WishlistItem } from '@/lib/wishlist-api';
import { cartApi } from '@/lib/cart-api';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';
import Toast from '@/components/Toast';

export default function WishlistPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const data = await wishlistApi.getWishlist();
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      setToast({ message: t('wishlist.productRemovedFromWishlist'), type: 'success' });
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      setToast({ message: t('wishlist.errorRemovingFromWishlist'), type: 'error' });
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await cartApi.addToCart({ productId, quantity: 1 });
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      setToast({ message: `${productName} ${t('productDetail.addedToCart')}`, type: 'success' });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setToast({ message: error.response?.data?.message || t('productDetail.errorAddingToCart'), type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('wishlist.loadingWishlist')}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('wishlist.myWishlist')}
              </h1>
              <p className="text-pink-100 text-lg">
                {wishlistItems.length > 0
                  ? `${t('wishlist.youHaveProducts')} ${wishlistItems.length} ${wishlistItems.length === 1 ? t('cart.product') : t('cart.productsPlural')} ${t('wishlist.productsInList')}`
                  : t('wishlist.saveYourFavorites')}
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">💝</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {t('wishlist.emptyWishlist')}
              </h2>
              <p className="text-gray-500 mb-8">
                {t('wishlist.emptyWishlistMessage')}
              </p>
              <Link
                href="/"
                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                {t('wishlist.exploreProducts')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <Link href={`/product/${item.productId}`}>
                    <div className="relative aspect-square overflow-hidden cursor-pointer">
                      {item.product.image_name ? (
                        <img
                          src={`/images/${item.product.image_name}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Sin imagen</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-emerald-600 line-clamp-2 cursor-pointer">
                        {item.product.name}
                      </h3>
                    </Link>

                    {(item.product.brand_name || item.product.brand?.name) && (
                      <p className="text-sm text-gray-600 mb-3">{item.product.brand_name || item.product.brand?.name}</p>
                    )}

                    <div className="mb-4">
                      <p className="text-emerald-600 font-bold text-2xl">
                        {formatGuaraniPriceNoDecimals(parseFloat(String(item.product.price)))}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item.productId, item.product.name)}
                        className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
                      >
                        {t('product.addToCart')}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('wishlist.productRemovedFromWishlist')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
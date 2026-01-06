'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { cartApi, CartItem } from '@/lib/cart-api';
import Toast from '@/components/Toast';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cart = await cartApi.getCart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    try {
      await cartApi.updateItem(productId, { quantity: newQuantity });
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      setToast({ message: t('cart.errorUpdatingQuantity'), type: 'error' });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await cartApi.removeItem(productId);
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      setToast({ message: t('cart.productRemovedFromCart'), type: 'success' });
    } catch (error: any) {
      console.error('Error removing item:', error);
      setToast({ message: t('cart.errorRemovingProduct'), type: 'error' });
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      setToast({ message: t('cart.cartCleared'), type: 'success' });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      setToast({ message: t('cart.errorClearingCart'), type: 'error' });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('cart.loadingCart')}</p>
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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cart.shoppingCart')}
            </h1>
            <p className="text-emerald-100 text-lg">
              {cartItems.length > 0 ? `${cartItems.length} ${cartItems.length > 1 ? t('cart.productsPlural') : t('cart.product')} ${t('cart.productsInCart').toLowerCase()}` : t('cart.emptyCart')}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {t('cart.emptyCart')}
            </h2>
            <p className="text-gray-500 mb-8">
              {t('cart.emptyCartMessage')}
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              {t('cart.continuesShopping')}
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{t('cart.productsInCart')}</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      {t('cart.clearCart')}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center border-b pb-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                          {item.product.image_name ? (
                            <img
                              src={`/images/${item.product.image_name}`}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<span class="text-gray-400 text-xs">${t('cart.noImage')}</span>`;
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">{t('cart.noImage')}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.product.name.length > 60 ? item.product.name.substring(0, 60) + '...' : item.product.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{item.product.brand_name || 'Sin marca'}</p>
                          <p className="text-emerald-600 font-bold">₲{item.product.price.toLocaleString('es-PY')}</p>
                        </div>

                        <div className="flex items-center space-x-2 mr-4">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{t('cart.orderSummary')}</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-400">
                      <span>{t('cart.inGuaranies')}</span>
                      <span>₲{calculateTotal().toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{t('cart.shipping')}:</span>
                      <span className="text-green-600">{t('cart.free')}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-gray-400">{t('cart.total')}:</span>
                        <span className="text-emerald-600">₲{calculateTotal().toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-center block"
                    >
                      {t('cart.proceedToPayment')}
                    </Link>
                    <Link
                      href="/"
                      className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center block"
                    >
                      {t('cart.continuesShopping')}
                    </Link>
                  </div>

                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-700 text-sm font-medium">{t('cart.freeShippingOver')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
}
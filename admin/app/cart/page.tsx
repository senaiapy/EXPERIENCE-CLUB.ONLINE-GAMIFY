'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  brand: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Dispatch cart updated event
    const event = new CustomEvent('cartUpdated', { detail: { count: updatedItems.length } });
    window.dispatchEvent(event);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    // Dispatch cart updated event
    const event = new CustomEvent('cartUpdated', { detail: { count: 0 } });
    window.dispatchEvent(event);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Carrito de Compras
            </h1>
            <p className="text-emerald-100 text-lg">
              {cartItems.length > 0 ? `${cartItems.length} producto${cartItems.length > 1 ? 's' : ''} en tu carrito` : 'Tu carrito está vacío'}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-8">
              Añade productos a tu carrito para continuar con la compra
            </p>
            <Link 
              href="/" 
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Productos en tu carrito</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center border-b pb-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                          <img 
                            src={`/images/${item.image}`} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<span class="text-gray-400 text-xs">Sin imagen</span>';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.name.length > 60 ? item.name.substring(0, 60) + '...' : item.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{item.brand}</p>
                          <p className="text-emerald-600 font-bold">{formatPrice(parseFloat(item.price))}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 mr-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-emerald-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                      Proceder al pago
                    </button>
                    <Link 
                      href="/" 
                      className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center block"
                    >
                      Continuar comprando
                    </Link>
                  </div>
                  
                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-700 text-sm font-medium">Envío gratis en compras superiores a $50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
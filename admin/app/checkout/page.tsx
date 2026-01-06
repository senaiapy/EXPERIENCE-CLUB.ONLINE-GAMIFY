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

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'transfer' | 'cash';
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Paraguay'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numPrice || 0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateCustomerInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    return required.every(field => customerInfo[field as keyof CustomerInfo].trim() !== '');
  };

  const validatePaymentInfo = () => {
    if (paymentInfo.method === 'card') {
      return paymentInfo.cardNumber && paymentInfo.cardName && 
             paymentInfo.cardExpiry && paymentInfo.cardCvv;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 'shipping' && validateCustomerInfo()) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && validatePaymentInfo()) {
      setCurrentStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order data
      const orderData = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: cartItems,
        customerInfo,
        paymentInfo: {
          method: paymentInfo.method,
          // Don't store sensitive card info
        },
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal()
      };
      
      // Store order in localStorage (in real app, this would be sent to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Redirect to confirmation page
      window.location.href = `/order-confirmation?orderId=${orderData.id}`;
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Checkout
              </h1>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-8">
              Añade productos a tu carrito antes de continuar con el checkout
            </p>
            <Link 
              href="/" 
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Finalizar Compra
            </h1>
            <p className="text-emerald-100 text-lg">
              Completa tu pedido de forma segura
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-emerald-600' : currentStep === 'payment' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'shipping' ? 'bg-emerald-600 text-white' : currentStep === 'payment' || currentStep === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Envío</span>
              </div>
              <div className={`w-16 h-1 ${currentStep === 'payment' || currentStep === 'review' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-emerald-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'payment' ? 'bg-emerald-600 text-white' : currentStep === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Pago</span>
              </div>
              <div className={`w-16 h-1 ${currentStep === 'review' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep === 'review' ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'review' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Revisar</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2">
              {/* Shipping Information */}
              {currentStep === 'shipping' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Tu apellido"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="+595 981 123 456"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Av. Mariscal López 1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Asunción"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={customerInfo.postalCode}
                        onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Link 
                      href="/cart"
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Volver al Carrito
                    </Link>
                    <button
                      onClick={handleNextStep}
                      disabled={!validateCustomerInfo()}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Continuar al Pago
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {currentStep === 'payment' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de Pago</h2>
                  
                  {/* Payment Methods */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handlePaymentInfoChange('method', 'card')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentInfo.method === 'card' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">💳</div>
                        <div className="font-medium">Tarjeta</div>
                        <div className="text-sm text-gray-500">Hasta 12 cuotas</div>
                      </button>
                      <button
                        onClick={() => handlePaymentInfoChange('method', 'transfer')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentInfo.method === 'transfer' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏛️</div>
                        <div className="font-medium">Transferencia</div>
                        <div className="text-sm text-gray-500">5% descuento</div>
                      </button>
                      <button
                        onClick={() => handlePaymentInfoChange('method', 'cash')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentInfo.method === 'cash' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-2">💵</div>
                        <div className="font-medium">Efectivo</div>
                        <div className="text-sm text-gray-500">10% descuento</div>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  {paymentInfo.method === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre en la Tarjeta
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => handlePaymentInfoChange('cardName', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vencimiento
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardExpiry}
                            onChange={(e) => handlePaymentInfoChange('cardExpiry', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardCvv}
                            onChange={(e) => handlePaymentInfoChange('cardCvv', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transfer Instructions */}
                  {paymentInfo.method === 'transfer' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Datos para Transferencia</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Banco:</strong> Banco Continental</p>
                        <p><strong>Cuenta:</strong> 123-456-789</p>
                        <p><strong>A nombre de:</strong> Experience Club S.A.</p>
                        <p><strong>RUC:</strong> 80123456-7</p>
                      </div>
                    </div>
                  )}

                  {/* Cash Instructions */}
                  {paymentInfo.method === 'cash' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Pago en Efectivo</h4>
                      <p className="text-sm text-green-700">
                        Recibirás un SMS con las instrucciones para realizar el pago en efectivo en nuestros puntos autorizados.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePreviousStep}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!validatePaymentInfo()}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Revisar Pedido
                    </button>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {currentStep === 'review' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Revisar Pedido</h2>
                  
                  {/* Customer Info Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de Envío</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
                      <p className="text-gray-600">{customerInfo.email}</p>
                      <p className="text-gray-600">{customerInfo.phone}</p>
                      <p className="text-gray-600">{customerInfo.address}</p>
                      <p className="text-gray-600">{customerInfo.city}, {customerInfo.country}</p>
                    </div>
                  </div>

                  {/* Payment Info Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Método de Pago</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {paymentInfo.method === 'card' && (
                        <p className="text-gray-600">💳 Tarjeta terminada en {paymentInfo.cardNumber.slice(-4)}</p>
                      )}
                      {paymentInfo.method === 'transfer' && (
                        <p className="text-gray-600">🏛️ Transferencia bancaria (5% descuento aplicado)</p>
                      )}
                      {paymentInfo.method === 'cash' && (
                        <p className="text-gray-600">💵 Pago en efectivo (10% descuento aplicado)</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePreviousStep}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleCompleteOrder}
                      disabled={isProcessing}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
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
                        <h4 className="font-medium text-gray-800 text-sm">
                          {item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name}
                        </h4>
                        <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span className={calculateShipping() === 0 ? 'text-green-600' : ''}>
                      {calculateShipping() === 0 ? 'Gratis' : formatPrice(calculateShipping())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos:</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  {(paymentInfo.method === 'transfer' || paymentInfo.method === 'cash') && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-{paymentInfo.method === 'transfer' ? '5%' : '10%'}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">
                        {formatPrice(
                          paymentInfo.method === 'transfer' ? calculateTotal() * 0.95 :
                          paymentInfo.method === 'cash' ? calculateTotal() * 0.90 :
                          calculateTotal()
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.065-1.035A9 9 0 1020.973 8.35a8.99 8.99 0 00-3.907-2.315" />
                    </svg>
                    <span className="text-green-700 text-sm font-medium">Compra 100% segura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
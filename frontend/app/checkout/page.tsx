'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cartApi, Cart, CartItem } from '@/lib/cart-api';
import { ordersApi, CreateOrderDto } from '@/lib/orders-api';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';
import { authApi } from '@/lib/auth-api';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

type PaymentMethod = 'COINS' | 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Paraguay'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COINS');
  const [notes, setNotes] = useState('');
  const [shippingCity, setShippingCity] = useState('');

  useEffect(() => {
    loadCartAndUserData();
  }, []);

  const loadCartAndUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      const token = authApi.getToken();
      if (!token) {
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      // Load user profile
      const user = await authApi.getProfile();

      // Pre-fill shipping info with user data
      setShippingInfo({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'Paraguay'
      });

      // Load cart
      const cartData = await cartApi.getCart();
      setCart(cartData);

      if (!cartData || cartData.items.length === 0) {
        router.push('/cart');
      }
    } catch (error: any) {
      console.error('Error loading checkout data:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login?redirect=/checkout');
      } else {
        setError(t('checkout.errorLoadingData'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingInfoChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateShippingInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    return required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '');
  };

  const calculateShipping = () => {
    // Free shipping - always 0
    return 0;
  };

  const calculateTax = () => {
    // 0% tax - IVA incluido
    if (!cart) return 0;
    return 0;
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.subtotal + calculateShipping() + calculateTax();
  };

  const handleCompleteOrder = async () => {
    if (!validateShippingInfo()) {
      setError(t('checkout.completeAllFields'));
      return;
    }

    if (!shippingCity) {
      setError(t('checkout.selectCityError'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const fullAddress = `${shippingInfo.address}`;
      const fullName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;

      const orderData: CreateOrderDto = {
        shippingAddress: fullAddress,
        shippingCity: shippingCity,
        shippingCountry: shippingInfo.country,
        postalCode: shippingInfo.postalCode || undefined,
        phone: shippingInfo.phone,
        paymentMethod: paymentMethod,
        shippingCost: calculateShipping(),
        tax: calculateTax(),
        notes: notes || `Cliente: ${fullName}, Email: ${shippingInfo.email}`
      };

      // Create order via API
      const order = await ordersApi.createOrder(orderData);

      // Dispatch order created event to update dashboard
      const event = new CustomEvent('orderCreated');
      window.dispatchEvent(event);

      // Redirect to order confirmation
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || t('checkout.errorProcessingOrder');
      setError(errorMessage);
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('checkout.checkout')}
              </h1>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
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
              {t('checkout.finishPurchase')}
            </h1>
            <p className="text-emerald-100 text-lg">
              {t('checkout.completeOrderSecurely')}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('checkout.shippingInformation')}</h2>
                  <p className="text-red-500 text-sm font-medium">{t('checkout.completeAllInfo')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingInfoChange('firstName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-500"
                      placeholder={t('checkout.yourName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingInfoChange('lastName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-500"
                      placeholder={t('checkout.yourLastName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.email')} *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingInfoChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-500"
                      placeholder={t('checkout.yourEmail')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.phone')} *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-500"
                      placeholder={t('checkout.yourPhone')}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.address')} *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={t('checkout.addressPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.city')} *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={t('checkout.cityPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.postalCode')}
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleShippingInfoChange('postalCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="1234"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('checkout.shippingMethod')}</h3>
                <p className="text-gray-600 mb-4">{t('checkout.selectCityForShipping')}</p>
                <div>
                  <select
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-500"
                  >
                    <option value="">{t('checkout.selectCity')}</option>
                    <option value="Asunción">Asunción</option>
                    <option value="Ciudad del Este">Ciudad del Este</option>
                    <option value="San Lorenzo">San Lorenzo</option>
                    <option value="Luque">Luque</option>
                    <option value="Capitán Bado">Capitán Bado</option>
                    <option value="Encarnación">Encarnación</option>
                    <option value="Pedro Juan Caballero">Pedro Juan Caballero</option>
                    <option value="Coronel Oviedo">Coronel Oviedo</option>
                  </select>
                </div>
                {shippingCity && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-700 font-medium">
                      {t('checkout.shippingTo')} {shippingCity}: {calculateShipping() === 0 ? t('cart.free').toUpperCase() : formatGuaraniPriceNoDecimals(calculateShipping())}
                    </p>
                    {calculateShipping() === 0 && (
                      <p className="text-emerald-600 text-sm mt-1">
                        {t('checkout.congratsFreeShipping')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('checkout.paymentMethod')}</h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('COINS')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'COINS'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'COINS'}
                        onChange={() => setPaymentMethod('COINS')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          🪙 Moedas (Game Currency)
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          Paga con tus moedas ganadas en el juego.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'CASH'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'CASH'}
                        onChange={() => setPaymentMethod('CASH')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          {t('checkout.cashPayment')}
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {t('checkout.cashPaymentDesc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('PIX')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'PIX'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'PIX'}
                        onChange={() => setPaymentMethod('PIX')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          🔑 Pix
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          Pago instantáneo con Pix. Recibirás el código QR por email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'CREDIT_CARD'}
                        onChange={() => setPaymentMethod('CREDIT_CARD')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          {t('checkout.creditCard')}
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {t('checkout.creditCardDesc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('DEBIT_CARD')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'DEBIT_CARD'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'DEBIT_CARD'}
                        onChange={() => setPaymentMethod('DEBIT_CARD')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          {t('checkout.debitCard')}
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {t('checkout.debitCardDesc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                        className="mt-1 w-4 h-4 text-emerald-600"
                      />
                      <div className="flex-1">
                        <label className="font-semibold text-gray-800 cursor-pointer">
                          {t('checkout.bankTransfer')}
                        </label>
                        <p className="text-gray-600 text-sm mt-1">
                          {t('checkout.bankTransferDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('checkout.observations')}</h3>
                <div>
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.writeMessageHere')}
                  </label>
                  <textarea
                    id="observaciones"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-gray-500"
                    placeholder={t('checkout.observationsPlaceholder')}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Link
                  href="/cart"
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('cart.backToCart')}
                </Link>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing || !validateShippingInfo() || !shippingCity}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('checkout.processing')}
                    </>
                  ) : (
                    <>
                      {t('checkout.buyNow')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('cart.orderSummary')}</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.image_name ? (
                          <img
                            src={`/images/${item.product.image_name}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">{t('cart.noImage')}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{t('checkout.quantity')} {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-gray-800 text-sm">
                        {formatGuaraniPriceNoDecimals((item.product.price_sale || item.product.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>{t('cart.subtotal')}:</span>
                    <span>{formatGuaraniPriceNoDecimals(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{t('cart.shipping')}:</span>
                    <span className={calculateShipping() === 0 ? 'text-green-600 font-semibold' : ''}>
                      {calculateShipping() === 0 ? t('cart.free').toUpperCase() : formatGuaraniPriceNoDecimals(calculateShipping())}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{t('checkout.ivaIncluded')}</span>
                    <span>₲0</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-500">{t('cart.total')}:</span>
                      <span className="text-emerald-600">
                        {formatGuaraniPriceNoDecimals(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-green-700 text-sm font-medium">{t('cart.secure')}</span>
                  </div>
                </div>

                {/* Items Count */}
                <div className="mt-4 text-center text-gray-600 text-sm">
                  {cart.itemCount} {cart.itemCount === 1 ? t('cart.product') : t('cart.productsPlural')} {t('cart.productsInCart')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
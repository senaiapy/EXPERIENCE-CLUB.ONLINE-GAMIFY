'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ordersApi, Order } from '@/lib/orders-api';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const whatsappNumber = process.env.NEXT_PUBLIC_ZAP_PHONE || '595991474601';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get order ID from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');

      if (!orderId) {
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      // Fetch order from API
      const fetchedOrder = await ordersApi.getById(orderId);
      setOrder(fetchedOrder);
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError(err.response?.data?.message || 'Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'PAID':
        return 'blue';
      case 'SHIPPED':
        return 'purple';
      case 'DELIVERED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Procesando';
      case 'PAID':
        return 'Pagado';
      case 'SHIPPED':
        return 'En Camino';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-red-500 to-red-700 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pedido no encontrado
              </h1>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No se pudo encontrar tu pedido
            </h2>
            <p className="text-gray-500 mb-8">
              {error || 'Verifica que hayas accedido correctamente desde el email de confirmación'}
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-500 to-green-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-4">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-green-100 text-lg">
              Tu pedido ha sido procesado exitosamente
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Pedido #{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <p className="text-gray-600">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Entrega</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {order.user.name || order.user.email}
                  </p>
                  <p className="text-gray-600">{order.user.email}</p>
                  {order.phone && <p className="text-gray-600">{order.phone}</p>}
                  {order.shippingAddress && <p className="text-gray-600">{order.shippingAddress}</p>}
                  <p className="text-gray-600">
                    {order.shippingCity}, {order.shippingCountry}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Pedido</h3>
                <div className={`bg-${statusColor}-50 p-4 rounded-lg`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 bg-${statusColor}-500 rounded-full mr-2`}></div>
                    <span className={`font-medium text-${statusColor}-700`}>{getStatusLabel(order.status)}</span>
                  </div>
                  <p className={`text-${statusColor}-600 text-sm`}>
                    {order.status === 'PENDING' && 'Tu pedido está siendo preparado para envío. Te notificaremos cuando esté en camino.'}
                    {order.status === 'PAID' && 'Pago confirmado. Tu pedido está siendo preparado.'}
                    {order.status === 'SHIPPED' && 'Tu pedido está en camino.'}
                    {order.status === 'DELIVERED' && 'Tu pedido ha sido entregado exitosamente.'}
                    {order.status === 'CANCELLED' && 'Este pedido ha sido cancelado.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Pedidos</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.image_name ? (
                        <img
                          src={`/images/${item.product.image_name}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {formatGuaraniPriceNoDecimals(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Observaciones</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Order Totals */}
            <div className="border-t pt-6">
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatGuaraniPriceNoDecimals(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span className={order.shippingCost === 0 ? 'text-green-600' : ''}>
                      {order.shippingCost === 0 ? 'GRATIS' : formatGuaraniPriceNoDecimals(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (0%) - IVA incluido:</span>
                    <span>₲0</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-600">
                      <span>Total:</span>
                      <span className="text-emerald-600">{formatGuaraniPriceNoDecimals(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Confirmación por Email</h3>
              </div>
              <p className="text-gray-600">
                Hemos enviado un email de confirmación a <strong>{order.user.email}</strong> con todos los detalles de tu pedido.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Notificaciones WhatsApp</h3>
              </div>
              <p className="text-gray-600">
                Te mantendremos informado del estado de tu pedido a través de WhatsApp{order.phone && ` al número ${order.phone}`}.
              </p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Tiempo de Entrega</h4>
                <p className="text-gray-600 text-sm">2-5 días hábiles</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Seguimiento</h4>
                <p className="text-gray-600 text-sm">Recibirás código de tracking</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.065-1.035A9 9 0 1020.973 8.35a8.99 8.99 0 00-3.907-2.315" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Garantía</h4>
                <p className="text-gray-600 text-sm">15 días para devoluciones</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Continuar Comprando
              </Link>
              <Link
                href="/dashboard"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ver Mis Pedidos
              </Link>
            </div>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.492"/>
                </svg>
                ¿Tienes preguntas? Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
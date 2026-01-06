'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ordersApi, Order as ApiOrder } from '@/lib/orders-api';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const orderData = await ordersApi.getById(orderId);

      if (!orderData) {
        throw new Error('Order not found');
      }

      setOrder(orderData);
    } catch (err: any) {
      console.error('Error loading order:', err);

      if (err.response?.status === 404) {
        setError('Pedido no encontrado');
      } else if (err.response?.status === 403 || err.response?.status === 401) {
        setError('No tienes permisos para ver este pedido');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(err instanceof Error ? err.message : 'Error al cargar el pedido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;

    const confirmMessage = `¿Estás seguro de cambiar el estado a "${getStatusLabel(newStatus)}"?`;
    if (!confirm(confirmMessage)) return;

    try {
      setIsUpdating(true);

      await ordersApi.update(order.id, { status: newStatus as any });

      // Reload order details
      await loadOrderDetails();

      alert('Estado actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Error al actualizar el estado del pedido');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; class: string; bgClass: string }> = {
      'PENDING': {
        label: 'Pendiente',
        class: 'text-yellow-800 dark:text-yellow-300',
        bgClass: 'bg-yellow-100 dark:bg-yellow-900'
      },
      'PAID': {
        label: 'Pagado',
        class: 'text-blue-800 dark:text-blue-300',
        bgClass: 'bg-blue-100 dark:bg-blue-900'
      },
      'SHIPPED': {
        label: 'Enviado',
        class: 'text-purple-800 dark:text-purple-300',
        bgClass: 'bg-purple-100 dark:bg-purple-900'
      },
      'DELIVERED': {
        label: 'Entregado',
        class: 'text-green-800 dark:text-green-300',
        bgClass: 'bg-green-100 dark:bg-green-900'
      },
      'CANCELLED': {
        label: 'Cancelado',
        class: 'text-red-800 dark:text-red-300',
        bgClass: 'bg-red-100 dark:bg-red-900'
      }
    };
    return statusMap[status] || { label: status, class: 'text-gray-800', bgClass: 'bg-gray-100' };
  };

  const getStatusLabel = (status: string) => {
    return getStatusInfo(status).label;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'CASH': 'Efectivo',
      'CREDIT_CARD': 'Tarjeta de Crédito',
      'DEBIT_CARD': 'Tarjeta de Débito',
      'BANK_TRANSFER': 'Transferencia Bancaria',
      'PAYPAL': 'PayPal',
      'OTHER': 'Otro'
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800 dark:text-red-200">{error || 'Error al cargar el pedido'}</h3>
          <Link
            href="/admin/orders"
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Volver a Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pedido #{order.id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Creado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          ← Volver
        </Link>
      </div>

      {/* Status and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Estado del Pedido</h2>
            <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${statusInfo.bgClass} ${statusInfo.class}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cambiar Estado</h3>
          <div className="flex flex-wrap gap-2">
            {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => handleUpdateStatus(status)}
                disabled={isUpdating || order.status === status}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order.status === status
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Cliente</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Nombre</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.user?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Teléfono</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Envío</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Dirección</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.shippingAddress || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Ciudad</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.shippingCity || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">País</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.shippingCountry || 'Paraguay'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Código Postal</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.postalCode || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Pago</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Método de Pago</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Estado de Pago</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.paymentStatus === 'PAID' ? 'Pagado' :
                 order.paymentStatus === 'UNPAID' ? 'No Pagado' :
                 order.paymentStatus === 'REFUNDED' ? 'Reembolsado' :
                 order.paymentStatus === 'FAILED' ? 'Fallido' : order.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos del Pedido</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.product?.name || 'Producto no disponible'}
                    </div>
                    {item.product?.ref && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        REF: {item.product.ref}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatGuaraniPriceNoDecimals(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {formatGuaraniPriceNoDecimals(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <div className="max-w-md ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatGuaraniPriceNoDecimals(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Envío:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.shippingCost > 0 ? formatGuaraniPriceNoDecimals(order.shippingCost) : 'GRATIS'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">IVA (10%):</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatGuaraniPriceNoDecimals(order.tax)}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{formatGuaraniPriceNoDecimals(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notas del Pedido</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

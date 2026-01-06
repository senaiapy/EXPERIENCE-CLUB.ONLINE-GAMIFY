'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/lib/orders-api';
import { formatGuaraniPriceNoDecimals } from '@/lib/currency';

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{ quantity: number }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch user orders from API
        try {
          const ordersResponse = await ordersApi.getMyOrders();
          // API returns array of orders
          setOrders(Array.isArray(ordersResponse) ? ordersResponse : []);
        } catch (orderError) {
          console.error('Error loading orders:', orderError);
          setOrders([]);
        }

        // Get wishlist count from API
        try {
          const { wishlistApi } = await import('@/lib/wishlist-api');
          const wishlistData = await wishlistApi.getWishlist();
          setWishlistCount(wishlistData.count || 0);
        } catch (wishlistError) {
          console.error('Error loading wishlist:', wishlistError);
          setWishlistCount(0);
        }

        // Get cart count from API
        try {
          const { cartApi } = await import('@/lib/cart-api');
          const cartData = await cartApi.getCart();
          setCartCount(cartData.itemCount || 0);
        } catch (cartError) {
          console.error('Error loading cart:', cartError);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Listen for data updates
    const handleDataUpdate = () => {
      loadDashboardData();
    };

    // Add event listeners for cart, wishlist, and order updates
    window.addEventListener('wishlistUpdated', handleDataUpdate);
    window.addEventListener('cartUpdated', handleDataUpdate);
    window.addEventListener('orderCreated', handleDataUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleDataUpdate);
      window.removeEventListener('cartUpdated', handleDataUpdate);
      window.removeEventListener('orderCreated', handleDataUpdate);
    };
  }, [user]);

  const getTotalSpent = () => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalItems = (order: Order) => {
    if (!order || !order.items || order.items.length === 0) return 0;
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered' || statusLower === 'entregado') return 'bg-green-100 text-green-800';
    if (statusLower === 'shipped' || statusLower === 'en tránsito') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'pending' || statusLower === 'pendiente') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'cancelled' || statusLower === 'cancelado') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'SHIPPED': 'En tránsito',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status.toUpperCase()] || status;
  };

  // Show loading while checking authentication or loading data
  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-lg">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name || user.email}</h3>
                  <p className="text-sm text-gray-500">Cliente desde {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mis Pedidos
                </button>
                <button
                  onClick={() => setActiveSection('wishlist')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'wishlist' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Lista de Deseos
                </button>
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Configuración
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">¡Hola, {user.name || user.email.split('@')[0]}!</h2>
                  <p className="opacity-90">Bienvenido de vuelta a tu cuenta de Experience Club</p>
                </div>

                {/* Stats Cards */}
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                            <p className="text-2xl font-bold text-gray-900">{formatGuaraniPriceNoDecimals(getTotalSpent())}</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">En Lista de Deseos</p>
                            <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
                          </div>
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
                  </div>
                  {orders.length > 0 ? (
                    <>
                      <div className="divide-y divide-gray-200">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="p-6 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Pedido #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-ES')} • {getTotalItems(order)} producto(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatGuaraniPriceNoDecimals(order.total)}</p>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {translateStatus(order.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t border-gray-200">
                        <button
                          onClick={() => setActiveSection('orders')}
                          className="text-emerald-600 hover:text-emerald-800 font-medium"
                        >
                          Ver todos los pedidos →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>No tienes pedidos aún</p>
                      <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium mt-2 inline-block">
                        Explorar productos
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Pedidos</h3>
                </div>
                {orders.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">Pedido #{order.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-500">Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {translateStatus(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{getTotalItems(order)} producto(s)</p>
                          <p className="font-semibold text-gray-900">{formatGuaraniPriceNoDecimals(order.total)}</p>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/order-confirmation?orderId=${order.id}`}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-2">No tienes pedidos aún</p>
                    <p className="text-gray-400 mb-4">Cuando realices tu primera compra, aparecerá aquí</p>
                    <Link
                      href="/"
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors inline-block"
                    >
                      Explorar productos
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Deseos</h3>
                  {wishlistCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      {wishlistCount} producto{wishlistCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-700 text-lg mb-2 font-semibold">
                      {wishlistCount > 0 ? `Tienes ${wishlistCount} producto${wishlistCount !== 1 ? 's' : ''} en tu lista de deseos` : 'Tu lista de deseos está vacía'}
                    </p>
                    <p className="text-gray-500 mb-6">
                      {wishlistCount > 0 ? 'Haz clic abajo para ver y gestionar tus productos favoritos' : 'Guarda tus productos favoritos para comprarlos más tarde'}
                    </p>
                    <Link
                      href="/wishlist"
                      className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center space-x-2 font-semibold"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{wishlistCount > 0 ? 'Ver mi lista de deseos' : 'Explorar productos'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={user.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <input
                        type="text"
                        value={user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miembro desde</label>
                      <input
                        type="text"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      Editar perfil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de la cuenta</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificaciones por email</h4>
                        <p className="text-sm text-gray-500">Recibir actualizaciones sobre pedidos y ofertas</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificaciones SMS</h4>
                        <p className="text-sm text-gray-500">Recibir SMS sobre el estado de tus pedidos</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-gray-900">Cambiar contraseña</h4>
                      <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente para mayor seguridad</p>
                    </button>
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <h4 className="font-medium text-gray-900">Autenticación de dos factores</h4>
                      <p className="text-sm text-gray-500">Agrega una capa extra de seguridad a tu cuenta</p>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border-red-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-red-600">Zona de peligro</h3>
                  </div>
                  <div className="p-6">
                    <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                      Eliminar cuenta
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
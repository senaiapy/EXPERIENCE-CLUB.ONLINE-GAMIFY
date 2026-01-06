'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mock user data - replace with actual auth context/API calls
const mockUser = {
  id: 1,
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '+595 981 123456',
  joinDate: '2024-01-15',
  totalOrders: 12,
  totalSpent: 2456780
};

const mockOrders = [
  {
    id: '12345',
    date: '2024-01-10',
    status: 'Entregado',
    total: 450000,
    items: 3
  },
  {
    id: '12344',
    date: '2024-01-05',
    status: 'En tránsito',
    total: 320000,
    items: 2
  },
  {
    id: '12343',
    date: '2023-12-28',
    status: 'Entregado',
    total: 180000,
    items: 1
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

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
              onClick={handleLogout}
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
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-gray-500">Cliente desde {new Date(user.joinDate).getFullYear()}</p>
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
                  <h2 className="text-2xl font-bold mb-2">¡Hola, {user.firstName}!</h2>
                  <p className="opacity-90">Bienvenido de vuelta a tu cuenta de Experience Club</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                        <p className="text-2xl font-bold text-gray-900">{user.totalOrders}</p>
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
                        <p className="text-2xl font-bold text-gray-900">₲{user.totalSpent.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-gray-900">5</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('es-ES')} • {order.items} producto(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₱ {order.total.toLocaleString()}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 
                            order.status === 'En tránsito' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
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
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Pedidos</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Pedido #{order.id}</h4>
                          <p className="text-sm text-gray-500">Realizado el {new Date(order.date).toLocaleDateString('es-ES')}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 
                          order.status === 'En tránsito' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{order.items} producto(s)</p>
                        <p className="font-semibold text-gray-900">₱ {order.total.toLocaleString()}</p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                          Ver detalles
                        </button>
                        {order.status === 'Entregado' && (
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Volver a comprar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Deseos</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-2">Tu lista de deseos está vacía</p>
                    <p className="text-gray-400 mb-4">Guarda tus productos favoritos para comprarlos más tarde</p>
                    <Link
                      href="/"
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors inline-block"
                    >
                      Explorar productos
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
                        value={user.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        value={user.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={user.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
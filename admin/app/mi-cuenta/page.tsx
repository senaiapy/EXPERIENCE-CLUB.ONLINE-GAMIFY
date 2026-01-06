'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

export default function MiCuentaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<UserData>({
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+595 981 123 456',
    address: 'Av. Mariscal López 1234, Asunción'
  });

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2025-01-15',
      total: 125.50,
      status: 'delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      total: 89.90,
      status: 'shipped',
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      total: 156.75,
      status: 'processing',
      items: 4
    }
  ]);

  useEffect(() => {
    // Simulate checking login status
    const loginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Mi Cuenta
              </h1>
              <p className="text-emerald-100 text-lg">
                Accede a tu cuenta para gestionar tus pedidos y datos personales
              </p>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
            </div>

            <div className="space-y-4">
              <Link 
                href="/auth/login"
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-center block"
              >
                Iniciar Sesión
              </Link>
              
              <div className="text-center">
                <span className="text-gray-500">¿No tienes cuenta? </span>
                <Link 
                  href="/auth/register" 
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>

              {/* Demo login button for testing */}
              <div className="border-t pt-4">
                <button
                  onClick={handleLogin}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  Demo: Ingresar como usuario de prueba
                </button>
              </div>
            </div>
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
              Mi Cuenta
            </h1>
            <p className="text-emerald-100 text-lg">
              Gestiona tu perfil, pedidos y preferencias
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* User Welcome */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-bold text-xl">
                    {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Hola, {userData.name}</h2>
                  <p className="text-gray-600">Bienvenido a tu cuenta Experience Club</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'profile'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'orders'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mis Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'wishlist'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Lista de Deseos
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'addresses'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Direcciones
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Mis Pedidos</h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-800">#{order.id}</span>
                            <span className="text-gray-600">{order.date}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-800">{formatPrice(order.total)}</div>
                            <div className="text-sm text-gray-600">{order.items} producto{order.items > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            Ver Detalles
                          </button>
                          {order.status === 'delivered' && (
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Volver a Comprar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Lista de Deseos</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💝</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Tu lista de deseos está vacía</h4>
                    <p className="text-gray-600 mb-4">Agrega productos que te gusten para comprarlos más tarde</p>
                    <Link 
                      href="/" 
                      className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Explorar Productos
                    </Link>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Mis Direcciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <h4 className="font-semibold text-gray-700 mb-2">Agregar Nueva Dirección</h4>
                      <p className="text-gray-600 text-sm mb-4">Agrega una dirección de entrega</p>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                        Agregar Dirección
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">Dirección Principal</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Por defecto</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Editar</button>
                      </div>
                      <p className="text-gray-600">{userData.address}</p>
                      <p className="text-gray-600">Asunción, Paraguay</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
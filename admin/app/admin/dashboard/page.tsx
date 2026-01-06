'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
  visitorsOnline: number;
  activeCarts: number;
  pendingOrders: number;
  abandonedCarts: number;
  newMessages: number;
  newCustomers: number;
  newSubscriptions: number;
  totalSubscribers: number;
  trafficSources: any;
  visitsData: any;
  salesData: any;
  ordersData: any;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ventas' | 'pedidos' | 'visitas'>('visitas');

  useEffect(() => {
    // Load stats data
    const loadStats = async () => {
      try {
        // Fetch real data from API
        const [productsRes, ordersStats, usersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=1`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        const productsData = await productsRes.json();
        const ordersData = ordersStats.ok ? await ordersStats.json() : { totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };
        const usersData = usersRes.ok ? await usersRes.json() : [];

        const mockStats: DashboardStats = {
          totalProducts: productsData.pagination?.total || 1247,
          totalOrders: ordersData.totalOrders || 89,
          totalCustomers: Array.isArray(usersData) ? usersData.length : 456,
          totalRevenue: ordersData.totalRevenue || 125300.50,
          lowStockProducts: 12,
          visitorsOnline: 23,
          activeCarts: 8,
          pendingOrders: ordersData.pendingOrders || 15,
          abandonedCarts: 34,
          newMessages: 7,
          newCustomers: 12,
          newSubscriptions: 5,
          totalSubscribers: 156,
          trafficSources: {
            labels: ['Búsqueda Directa', 'Redes Sociales', 'Google', 'Referencias', 'Correo', 'Instagram', 'Facebook'],
            datasets: [{
              data: [35, 25, 20, 8, 7, 3, 2],
              backgroundColor: [
                '#10B981', // emerald-500
                '#8B5CF6', // violet-500
                '#06B6D4', // cyan-500
                '#F59E0B', // amber-500
                '#EF4444', // red-500
                '#EC4899', // pink-500
                '#6366F1'  // indigo-500
              ],
              borderWidth: 0,
              cutout: '60%'
            }]
          },
          visitsData: {
            labels: ['01/09/2025', '02/09/2025', '03/09/2025', '04/09/2025', '05/09/2025', '06/09/2025', '07/09/2025', '08/09/2025', '09/09/2025', '10/09/2025', '11/09/2025', '12/09/2025'],
            datasets: [{
              label: 'Visitas',
              data: [120, 280, 300, 160, 580, 240, 350, 100, 120, 150, 200, 180],
              borderColor: '#EC4899',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 3
            }]
          },
          salesData: {
            labels: ['01/09/2025', '02/09/2025', '03/09/2025', '04/09/2025', '05/09/2025', '06/09/2025', '07/09/2025', '08/09/2025', '09/09/2025', '10/09/2025', '11/09/2025', '12/09/2025'],
            datasets: [{
              label: 'Ventas',
              data: [1200, 2800, 1800, 2200, 3200, 2600, 2900, 1800, 2100, 2400, 2700, 2300],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 3
            }]
          },
          ordersData: {
            labels: ['01/09/2025', '02/09/2025', '03/09/2025', '04/09/2025', '05/09/2025', '06/09/2025', '07/09/2025', '08/09/2025', '09/09/2025', '10/09/2025', '11/09/2025', '12/09/2025'],
            datasets: [{
              label: 'Pedidos',
              data: [12, 28, 18, 22, 32, 26, 29, 18, 21, 24, 27, 23],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 3
            }]
          },
          recentOrders: [
            { id: '#ORD-001', customer: 'María González', total: 89.99, status: 'completed', date: '2024-01-15' },
            { id: '#ORD-002', customer: 'Carlos López', total: 156.50, status: 'pending', date: '2024-01-15' },
            { id: '#ORD-003', customer: 'Ana Martínez', total: 78.25, status: 'processing', date: '2024-01-14' },
            { id: '#ORD-004', customer: 'Luis Rodriguez', total: 234.75, status: 'completed', date: '2024-01-14' },
            { id: '#ORD-005', customer: 'Sofia Vera', total: 112.00, status: 'shipped', date: '2024-01-13' }
          ],
          topProducts: [
            { name: 'Perfume Chanel No. 5', sales: 45, revenue: 6750.00 },
            { name: 'Dior Sauvage', sales: 38, revenue: 4940.00 },
            { name: 'Calvin Klein Eternity', sales: 32, revenue: 3840.00 },
            { name: 'Versace Bright Crystal', sales: 28, revenue: 3640.00 },
            { name: 'Armani Code', sales: 24, revenue: 3120.00 }
          ]
        };

        setTimeout(() => {
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading stats:', error);
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#374151',
          lineWidth: 0.5
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: '#374151',
          lineWidth: 0.5
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#9CA3AF',
          font: {
            size: 12
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-80"></div>
          <div className="lg:col-span-2 bg-gray-300 dark:bg-gray-700 rounded-lg h-80"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-96"></div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getCurrentChartData = () => {
    switch (activeTab) {
      case 'ventas':
        return stats.salesData;
      case 'pedidos':
        return stats.ordersData;
      case 'visitas':
      default:
        return stats.visitsData;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Resumen general de tu tienda</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Último update</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Ver productos →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
              Ver pedidos →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/customers" className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400">
              Ver clientes →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₲{Math.round(stats.totalRevenue).toLocaleString('es-PY')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/reports/sales" className="text-sm text-yellow-600 hover:text-yellow-500 dark:text-yellow-400">
              Ver reportes →
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Sources Donut Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Fuentes de Tráfico</h2>
          <div className="h-64">
            <Doughnut data={stats.trafficSources} options={donutOptions} />
          </div>
        </div>

        {/* Line Chart with Tabs */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {/* Chart Header with Tabs */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de Actividades</h2>
            </div>
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('ventas')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'ventas'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                VENTAS
              </button>
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'pedidos'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                PEDIDOS
              </button>
              <button
                onClick={() => setActiveTab('visitas')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'visitas'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                VISITAS
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="p-6">
            <div className="h-64">
              <Line data={getCurrentChartData()} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de Actividades</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visitantes en Línea</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">en los últimos 30 minutos</p>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{stats.visitorsOnline}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Carritos activos</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">en los últimos 30 minutos</p>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{stats.activeCarts}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">Pendientes</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Carritos abandonados</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.abandonedCarts}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pedidos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">Notificaciones</p>
              <p className="text-2xl font-bold">{stats.newMessages}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nuevos Mensajes</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.newMessages}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">Clientes y Boletín</p>
              <p className="text-sm opacity-75">(DESDE 01-09-2025 HASTA 30-09-2025)</p>
              <p className="text-2xl font-bold">{stats.newCustomers}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cliente Nuevos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.newCustomers}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nuevas suscripciones</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.newSubscriptions}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de suscriptores</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalSubscribers}</p>
            </div>

            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <p className="text-sm opacity-90">Tráfico</p>
              <p className="text-sm opacity-75">(DESDE 01-09-2025 HASTA 30-09-2025)</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visitas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">1,247</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for low stock */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Productos con stock bajo
              </h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                <p>
                  Tienes {stats.lowStockProducts} productos con stock bajo que requieren atención.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/inventory?filter=low-stock"
                  className="text-sm bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                >
                  Ver inventario
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos Recientes</h2>
              <Link href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Ver todos
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₲{Math.round(order.total).toLocaleString('es-PY')}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Productos Más Vendidos</h2>
              <Link href="/admin/reports/products" className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Ver reporte
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} ventas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₲{Math.round(product.revenue).toLocaleString('es-PY')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/add"
            className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium text-emerald-900 dark:text-emerald-100">Agregar Producto</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Añadir nuevo producto al catálogo</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium text-blue-900 dark:text-blue-100">Gestionar Pedidos</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Procesar y actualizar pedidos</p>
            </div>
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium text-purple-900 dark:text-purple-100">Ver Reportes</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Análisis y estadísticas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
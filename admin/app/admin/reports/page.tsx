'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last_30_days');

  const reports = [
    {
      id: 'sales',
      title: 'Reporte de Ventas',
      description: 'Análisis detallado de las ventas por período',
      icon: '📊',
      color: 'bg-blue-500',
      href: '/admin/reports/sales'
    },
    {
      id: 'products',
      title: 'Reporte de Productos',
      description: 'Productos más vendidos y estadísticas de inventario',
      icon: '📦',
      color: 'bg-emerald-500',
      href: '/admin/reports/products'
    },
    {
      id: 'customers',
      title: 'Reporte de Clientes',
      description: 'Análisis de comportamiento y segmentación de clientes',
      icon: '👥',
      color: 'bg-purple-500',
      href: '/admin/reports/customers'
    },
    {
      id: 'inventory',
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario y movimientos de stock',
      icon: '📋',
      color: 'bg-orange-500',
      href: '/admin/reports/inventory'
    },
    {
      id: 'financial',
      title: 'Reporte Financiero',
      description: 'Estados financieros y análisis de rentabilidad',
      icon: '💰',
      color: 'bg-yellow-500',
      href: '/admin/reports/financial'
    },
    {
      id: 'marketing',
      title: 'Reporte de Marketing',
      description: 'Efectividad de campañas y canales de adquisición',
      icon: '📈',
      color: 'bg-pink-500',
      href: '/admin/reports/marketing'
    }
  ];

  const quickStats = [
    { title: 'Ventas Hoy', value: '$1,245', change: '+12%', positive: true },
    { title: 'Pedidos Hoy', value: '23', change: '+8%', positive: true },
    { title: 'Productos Vendidos', value: '156', change: '+15%', positive: true },
    { title: 'Tasa de Conversión', value: '3.2%', change: '-2%', positive: false }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes y Análisis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Información detallada sobre el rendimiento de tu negocio
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="last_7_days">Últimos 7 días</option>
            <option value="last_30_days">Últimos 30 días</option>
            <option value="last_90_days">Últimos 90 días</option>
            <option value="this_year">Este año</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 ${
                stat.positive ? 'bg-green-200' : 'bg-red-200'
              }`}>
                <div 
                  className={`h-2 rounded-full ${
                    stat.positive ? 'bg-green-600' : 'bg-red-600'
                  }`} 
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link key={report.id} href={report.href} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                  {report.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {report.description}
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                Ver reporte
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Actividad Reciente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                action: 'Nuevo pedido recibido',
                details: 'Pedido #ORD-2024-008 por $156.50',
                time: 'Hace 5 minutos',
                type: 'order'
              },
              {
                action: 'Producto con stock bajo',
                details: 'Dior Sauvage tiene solo 8 unidades',
                time: 'Hace 12 minutos',
                type: 'inventory'
              },
              {
                action: 'Cliente registrado',
                details: 'Nueva cuenta: pedro@example.com',
                time: 'Hace 1 hora',
                type: 'customer'
              },
              {
                action: 'Pago procesado',
                details: 'Pago de $234.75 confirmado',
                time: 'Hace 2 horas',
                type: 'payment'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                  activity.type === 'inventory' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' :
                  activity.type === 'customer' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                  'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {activity.type === 'order' ? '📋' : 
                   activity.type === 'inventory' ? '📦' :
                   activity.type === 'customer' ? '👤' : '💳'}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.details}
                  </p>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exportar Datos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exportar a Excel</span>
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exportar a PDF</span>
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exportar a CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
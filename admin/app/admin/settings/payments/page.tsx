'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PaymentsSettingsPage() {
  const [settings, setSettings] = useState({
    stripEnabled: true,
    paypalEnabled: true,
    creditCardEnabled: true,
    bankTransferEnabled: true,
    cashOnDeliveryEnabled: false,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    paypalClientId: 'AXX...',
    paypalClientSecret: 'EHT...',
    bankAccount: '1234567890',
    bankName: 'Banco Nacional',
    minimumAmount: 50,
    processingFee: 3.5
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Configuración de pagos guardada exitosamente!');
    } catch (error) {
      alert('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración de Pagos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los métodos de pago disponibles</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/settings"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ← Volver
          </Link>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Métodos de Pago</h2>
        </div>
        <div className="p-6 space-y-6">
          {[
            { key: 'stripEnabled', title: 'Stripe', description: 'Procesamiento de tarjetas de crédito/débito' },
            { key: 'paypalEnabled', title: 'PayPal', description: 'Pagos con cuenta PayPal' },
            { key: 'creditCardEnabled', title: 'Tarjetas de Crédito', description: 'Visa, Mastercard, American Express' },
            { key: 'bankTransferEnabled', title: 'Transferencia Bancaria', description: 'Transferencia directa a cuenta bancaria' },
            { key: 'cashOnDeliveryEnabled', title: 'Pago Contra Entrega', description: 'Pago en efectivo al recibir el producto' }
          ].map((method) => (
            <div key={method.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{method.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[method.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleChange(method.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Stripe</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clave Pública
              </label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={(e) => handleChange('stripePublicKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clave Secreta
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PayPal Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de PayPal</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={settings.paypalClientId}
                onChange={(e) => handleChange('paypalClientId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={settings.paypalClientSecret}
                onChange={(e) => handleChange('paypalClientSecret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bank Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Información Bancaria</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Cuenta
              </label>
              <input
                type="text"
                value={settings.bankAccount}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Banco
              </label>
              <input
                type="text"
                value={settings.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración General</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Mínimo de Pago ($)
              </label>
              <input
                type="number"
                value={settings.minimumAmount}
                onChange={(e) => handleChange('minimumAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comisión de Procesamiento (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.processingFee}
                onChange={(e) => handleChange('processingFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
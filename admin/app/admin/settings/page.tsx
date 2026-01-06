'use client';

import { useState, useEffect } from 'react';
import { settingsApi, Settings } from '../../../lib/settings-api';

export default function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Error al cargar la configuración' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings) return;

    try {
      setIsSaving(true);
      setMessage(null);

      // Only send fields that the DTO expects - remove id, createdAt, updatedAt
      const { id, createdAt, updatedAt, ...settingsToUpdate } = settings;

      // Clean the data before sending
      const cleanedSettings: any = { ...settingsToUpdate };

      // Remove fields with empty strings and convert to null for optional fields
      Object.keys(cleanedSettings).forEach(key => {
        if (cleanedSettings[key] === '') {
          cleanedSettings[key] = null;
        }
      });

      // Remove null values for optional fields to avoid validation errors
      Object.keys(cleanedSettings).forEach(key => {
        if (cleanedSettings[key] === null) {
          delete cleanedSettings[key];
        }
      });

      console.log('Sending settings:', cleanedSettings);

      await settingsApi.updateSettings(cleanedSettings);

      setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });

      // Reload settings to get updated values
      await loadSettings();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message || 'Error al guardar la configuración' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (!settings) return;

    let newValue: any = value;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      // For number inputs, keep as number or 0
      const parsed = parseFloat(value);
      newValue = isNaN(parsed) ? 0 : parsed;
    }

    setSettings({
      ...settings,
      [name]: newValue
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '🌐' },
    { id: 'contact', label: 'Contacto', icon: '📧' },
    { id: 'social', label: 'Redes Sociales', icon: '👥' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'shipping', label: 'Envíos', icon: '🚚' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'features', label: 'Características', icon: '⚡' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: No se pudieron cargar las configuraciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración General</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra la configuración general de tu tienda
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idioma *
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="SPANISH">Español</option>
                    <option value="ENGLISH">English</option>
                    <option value="PORTUGUESE">Português</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Sitio *
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Experience Club"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción del Sitio
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tu tienda online de confianza"
                  />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={settings.contactEmail || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="contacto@experienceclub.com"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+595 21 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email de Soporte
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value={settings.supportEmail || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="soporte@experienceclub.com"
                  />
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    name="facebookUrl"
                    value={settings.facebookUrl || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://facebook.com/experienceclub"
                  />
                </div>

                <div>
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagramUrl"
                    name="instagramUrl"
                    value={settings.instagramUrl || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://instagram.com/experienceclub"
                  />
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={settings.whatsappNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="595991474601"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Sin el símbolo +, formato: código de país + número
                  </p>
                </div>
              </div>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moneda *
                    </label>
                    <input
                      type="text"
                      id="currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="PYG"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Símbolo de Moneda *
                    </label>
                    <input
                      type="text"
                      id="currencySymbol"
                      name="currencySymbol"
                      value={settings.currencySymbol}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="₲"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasa de Cambio (USD a moneda local) *
                    </label>
                    <input
                      type="number"
                      id="exchangeRate"
                      name="exchangeRate"
                      value={settings.exchangeRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="7300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasa de Impuesto (%) *
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="defaultShippingCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Costo de Envío por Defecto
                  </label>
                  <input
                    type="number"
                    id="defaultShippingCost"
                    name="defaultShippingCost"
                    value={settings.defaultShippingCost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Umbral de Envío Gratis
                  </label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="100000"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monto mínimo de compra para envío gratis (0 = sin envío gratis)
                  </p>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={settings.metaTitle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Experience Club - Tu tienda online"
                    maxLength={60}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Máximo 60 caracteres recomendados
                  </p>
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={settings.metaDescription || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Encuentra las mejores ofertas en productos de calidad"
                    maxLength={160}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Máximo 160 caracteres recomendados
                  </p>
                </div>

                <div>
                  <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="metaKeywords"
                    name="metaKeywords"
                    value={settings.metaKeywords || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="ofertas, descuentos, tienda online, Paraguay"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Separados por comas
                  </p>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableCart"
                      checked={settings.enableCart}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar Carrito de Compras
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableWishlist"
                      checked={settings.enableWishlist}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar Lista de Deseos
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableReviews"
                      checked={settings.enableReviews}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar Reseñas de Productos
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableCoupons"
                      checked={settings.enableCoupons}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar Cupones de Descuento
                    </span>
                  </label>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-3 text-sm font-medium text-red-700 dark:text-red-400">
                        Modo de Mantenimiento
                      </span>
                    </label>

                    {settings.maintenanceMode && (
                      <div className="mt-4">
                        <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mensaje de Mantenimiento
                        </label>
                        <textarea
                          id="maintenanceMessage"
                          name="maintenanceMessage"
                          value={settings.maintenanceMessage || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Sitio en mantenimiento. Volvemos pronto."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={loadSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg transition-colors ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                }`}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

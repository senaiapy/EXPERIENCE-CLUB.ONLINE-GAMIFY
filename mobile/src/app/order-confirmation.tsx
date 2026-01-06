import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useOrder } from '@/api/orders';
import { Button, Text, View } from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'PAID':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
  }
};

export default function OrderConfirmationScreen() {
  const { t } = useTranslation();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { data: order, isLoading, error } = useOrder({ variables: { id: orderId! } });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-neutral-600">{t('order.loading')}</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-lg text-neutral-900 dark:text-white">
          {t('order.not_found')}
        </Text>
        <Button label={t('dashboard.go_to_dashboard')} onPress={() => router.push('/dashboard')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 p-4">
        {/* Success Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle width={48} height={48} color="#10b981" />
          </View>
          <Text className="mb-2 text-center text-2xl font-bold text-neutral-900 dark:text-white">
            {t('order.confirmed')}
          </Text>
          <Text className="text-center text-neutral-600 dark:text-neutral-400">
            {t('order.thank_you')}
          </Text>
        </View>

        {/* Order Info */}
        <View className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-neutral-600 dark:text-neutral-400">{t('order.order_id')}</Text>
            <Text className="font-mono font-semibold text-neutral-900 dark:text-white">
              {order.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-neutral-600 dark:text-neutral-400">{t('order.date')}</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              {new Date(order.createdAt).toLocaleDateString('es-PY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-neutral-600 dark:text-neutral-400">{t('order.status')}</Text>
            <View className={`rounded-full px-3 py-1 ${getStatusColor(order.status)}`}>
              <Text className="text-sm font-semibold">{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
            {t('order.delivery_address')}
          </Text>
          <View className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <Text className="mb-1 font-semibold text-neutral-900 dark:text-white">
              {order.shippingAddress}
            </Text>
            <Text className="mb-1 text-neutral-600 dark:text-neutral-400">
              {order.shippingCity}, {order.shippingCountry}
            </Text>
            {order.postalCode && (
              <Text className="mb-1 text-neutral-600 dark:text-neutral-400">
                {order.postalCode}
              </Text>
            )}
            <Text className="text-neutral-600 dark:text-neutral-400">{order.phone}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
            {t('order.items')}
          </Text>
          <View className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            {order.items.map((item, index) => (
              <View
                key={item.id}
                className={`p-4 ${
                  index !== order.items.length - 1
                    ? 'border-b border-neutral-200 dark:border-neutral-700'
                    : ''
                }`}
              >
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 font-semibold text-neutral-900 dark:text-white">
                      {item.product?.name || 'Product'}
                    </Text>
                    <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                      {t('product.quantity')}: {item.quantity}
                    </Text>
                  </View>
                  <Text className="font-semibold text-neutral-900 dark:text-white">
                    Gs. {(item.price * item.quantity).toLocaleString('es-PY')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Totals */}
        <View className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <View className="mb-2 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">{t('checkout.subtotal')}</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              Gs. {order.subtotal.toLocaleString('es-PY')}
            </Text>
          </View>

          <View className="mb-2 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">{t('checkout.shipping')}</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              {order.shippingCost === 0
                ? t('checkout.free')
                : `Gs. ${order.shippingCost.toLocaleString('es-PY')}`}
            </Text>
          </View>

          <View className="mb-4 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">{t('checkout.tax')}</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              Gs. {order.tax.toLocaleString('es-PY')}
            </Text>
          </View>

          <View className="border-t border-neutral-300 pt-4 dark:border-neutral-600">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('cart.total')}
              </Text>
              <Text className="text-xl font-bold text-primary-600">
                Gs. {order.total.toLocaleString('es-PY')}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <Text className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
            {t('checkout.payment_method')}
          </Text>
          <Text className="font-semibold text-neutral-900 dark:text-white">
            {order.paymentMethod === 'CASH' && t('checkout.cash')}
            {order.paymentMethod === 'CREDIT_CARD' && t('checkout.credit_card')}
            {order.paymentMethod === 'DEBIT_CARD' && t('checkout.debit_card')}
            {order.paymentMethod === 'BANK_TRANSFER' && t('checkout.bank_transfer')}
            {order.paymentMethod === 'PAYPAL' && 'PayPal'}
            {order.paymentMethod === 'OTHER' && t('common.other')}
          </Text>
        </View>

        {/* Additional Info */}
        {order.notes && (
          <View className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <Text className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
              {t('checkout.notes')}
            </Text>
            <Text className="text-neutral-900 dark:text-white">{order.notes}</Text>
          </View>
        )}

        {/* Info Boxes */}
        <View className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
          <Text className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            📧 {t('order.email_sent')}
          </Text>
          <Text className="text-sm text-blue-800 dark:text-blue-200">
            {t('order.email_message')}
          </Text>
        </View>

        <View className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900">
          <Text className="mb-2 font-semibold text-green-900 dark:text-green-100">
            🚚 {t('order.delivery_info')}
          </Text>
          <Text className="text-sm text-green-800 dark:text-green-200">
            {t('order.delivery_days')}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button label={t('product.continue_shopping')} onPress={() => router.push('/')} />
          <Button
            label={t('order.view_orders')}
            variant="outline"
            onPress={() => router.push('/dashboard')}
          />
        </View>

        <View className="mb-8 mt-6">
          <Text className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            {t('order.support')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

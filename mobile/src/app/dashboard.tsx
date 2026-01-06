import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useMyOrders } from '@/api/orders';
import { Button, Text, View } from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';
import { useAuth, signOut } from '@/lib/auth';
import { useWishlist } from '@/lib/wishlist';

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

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuth.use.user();
  const wishlistItems = useWishlist.use.items();

  const { data: ordersData, isLoading } = useMyOrders({
    variables: { page: 1, limit: 10 },
  });

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  // Safely handle orders data - might be array or object with data property
  const orders = Array.isArray(ordersData)
    ? ordersData
    : Array.isArray((ordersData as any)?.data)
    ? (ordersData as any).data
    : [];

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, order: any) => sum + (order?.total || 0), 0);
  const wishlistCount = wishlistItems.length;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
            {t('dashboard.title')}
          </Text>
          <Text className="text-neutral-600 dark:text-neutral-400">
            {t('dashboard.welcome')}, {user?.name || t('dashboard.user')}!
          </Text>
        </View>

        {/* Statistics Cards */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <Text className="mb-1 text-2xl font-bold text-primary-600">
              {totalOrders}
            </Text>
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('dashboard.total_orders')}
            </Text>
          </View>

          <View className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <Text className="mb-1 text-2xl font-bold text-primary-600">
              {wishlistCount}
            </Text>
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('dashboard.wishlist_items')}
            </Text>
          </View>
        </View>

        <View className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <Text className="mb-1 text-2xl font-bold text-primary-600">
            Gs. {totalSpent.toLocaleString('es-PY')}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('dashboard.total_spent')}
          </Text>
        </View>

        {/* Profile Information */}
        <View className="mb-6">
          <Text className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">
            {t('dashboard.profile_info')}
          </Text>
          <View className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <View className="mb-3">
              <Text className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                {t('auth.name')}
              </Text>
              <Text className="font-semibold text-neutral-900 dark:text-white">
                {user?.name || t('dashboard.not_set')}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                {t('auth.email')}
              </Text>
              <Text className="font-semibold text-neutral-900 dark:text-white">
                {user?.email || t('dashboard.not_set')}
              </Text>
            </View>

            {user?.phone && (
              <View className="mb-3">
                <Text className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {t('checkout.phone')}
                </Text>
                <Text className="font-semibold text-neutral-900 dark:text-white">
                  {user.phone}
                </Text>
              </View>
            )}

            {user?.address && (
              <View className="mb-3">
                <Text className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {t('checkout.address')}
                </Text>
                <Text className="font-semibold text-neutral-900 dark:text-white">
                  {user.address}
                </Text>
                {user.city && (
                  <Text className="text-neutral-600 dark:text-neutral-400">
                    {user.city}, {user.country || 'Paraguay'}
                  </Text>
                )}
              </View>
            )}

            <View>
              <Text className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                {t('profile.member_since')}
              </Text>
              <Text className="font-semibold text-neutral-900 dark:text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('es-PY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Orders */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-neutral-900 dark:text-white">
              {t('dashboard.recent_orders')}
            </Text>
            {totalOrders > 3 && (
              <TouchableOpacity onPress={() => {}}>
                <Text className="text-primary-600">{t('dashboard.view_all')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : orders.length === 0 ? (
            <View className="items-center rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-800">
              <Text className="mb-2 text-center text-neutral-600 dark:text-neutral-400">
                {t('dashboard.no_orders')}
              </Text>
              <Text className="mb-4 text-center text-sm text-neutral-500 dark:text-neutral-500">
                {t('dashboard.start_shopping')}
              </Text>
              <Button
                label={t('dashboard.browse_products')}
                variant="outline"
                onPress={() => router.push('/')}
              />
            </View>
          ) : (
            <View className="gap-3">
              {orders.slice(0, 5).map((order: any) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() =>
                    router.push(`/order-confirmation?orderId=${order.id}`)
                  }
                  className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </Text>
                    <View
                      className={`rounded-full px-3 py-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <Text className="text-xs font-semibold">{order.status}</Text>
                    </View>
                  </View>

                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString('es-PY')}
                    </Text>
                    <Text className="font-semibold text-neutral-900 dark:text-white">
                      Gs. {order.total.toLocaleString('es-PY')}
                    </Text>
                  </View>

                  <Text className="text-sm text-neutral-500 dark:text-neutral-500">
                    {order.items.length} {order.items.length !== 1 ? t('checkout.items') : t('dashboard.item')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">
            {t('dashboard.quick_actions')}
          </Text>
          <View className="gap-3">
            <Button
              label={`${t('dashboard.view_wishlist')} (${wishlistCount})`}
              variant="outline"
              onPress={() => router.push('/wishlist')}
            />
            <Button
              label={t('product.continue_shopping')}
              variant="outline"
              onPress={() => router.push('/')}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View className="mb-8">
          <Button label={t('profile.sign_out')} variant="destructive" onPress={handleSignOut} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

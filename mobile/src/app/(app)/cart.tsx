import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, CartItemCard, View, Text } from '@/components/ui';
import { useCart } from '@/lib';

export default function CartScreen() {
  const { t } = useTranslation();
  const cartList = useCart.use.cartList();
  const totalPrice = useCart.use.totalPrice();

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FlashList
        data={cartList}
        renderItem={({ item }) => <CartItemCard item={item} />}
        estimatedItemSize={150}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-lg text-neutral-500">{t('cart.empty')}</Text>
            <Text className="mt-2 text-center text-sm text-neutral-400">
              {t('cart.empty_message')}
            </Text>
          </View>
        }
      />

      {/* Checkout Footer */}
      {cartList.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <View className="mb-3 flex-row justify-between">
            <Text className="text-lg font-semibold">{t('cart.total')}:</Text>
            <Text className="text-lg font-bold text-primary-600">
              ₲{totalPrice.toLocaleString('es-PY')}
            </Text>
          </View>
          <Button label={t('cart.checkout')} onPress={() => router.push('/checkout')} />
        </View>
      )}
    </View>
  );
}

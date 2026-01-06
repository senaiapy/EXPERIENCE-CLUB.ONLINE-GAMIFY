import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ProductCard, View, Text } from '@/components/ui';
import { useWishlist } from '@/lib';

export default function WishlistScreen() {
  const { t } = useTranslation();
  const items = useWishlist.use.items();

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
        )}
        numColumns={2}
        estimatedItemSize={250}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-lg text-neutral-500">{t('wishlist.empty')}</Text>
            <Text className="mt-2 text-center text-sm text-neutral-400">
              {t('wishlist.empty_message')}
            </Text>
          </View>
        }
      />
    </View>
  );
}

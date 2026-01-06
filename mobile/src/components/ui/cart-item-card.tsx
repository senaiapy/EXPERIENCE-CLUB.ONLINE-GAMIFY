import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useCartSync } from '@/lib/cart';
import type { CartItem } from '@/lib/cart';
import { getProductImageUrl } from '@/lib/image-utils';

import { Text, View } from './index';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard = ({ item }: CartItemCardProps) => {
  const { t } = useTranslation();
  const { incrementQuantity, decrementQuantity, removeFromCart, isUpdating, isRemoving } = useCartSync();

  const { product, quantity } = item;
  const price = product.price_sale || product.price;
  const imageUrl = getProductImageUrl(product);
  const totalItemPrice = price * quantity;

  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white p-3 dark:bg-neutral-800">
      <View className="flex-row">
        {/* Image */}
        <Image
          source={{ uri: imageUrl }}
          className="h-24 w-24 rounded-xl"
          contentFit="cover"
        />

        {/* Details */}
        <View className="ml-3 flex-1">
          <Text numberOfLines={2} className="mb-1 text-base font-semibold">
            {product.name}
          </Text>

          {product.brand?.name && (
            <Text numberOfLines={1} className="mb-2 text-xs text-neutral-500">
              {product.brand.name}
            </Text>
          )}

          {/* Price per unit */}
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              {/* Original price (price + 10%) with strikethrough */}
              <Text className="text-[10px] text-neutral-400 line-through">
                ₲{Math.round(price * 1.1).toLocaleString('es-PY')}
              </Text>
              {/* Current price */}
              <Text className="text-sm font-semibold text-primary-600">
                ₲{price.toLocaleString('es-PY')} {t('cart.each')}
              </Text>
            </View>

            {/* Stock status */}
            {product.stock > 0 ? (
              <Text className="text-xs text-green-600 dark:text-green-400">
                {product.stock} {t('cart.in_stock')}
              </Text>
            ) : (
              <Text className="text-xs text-red-600 dark:text-red-400">
                {t('cart.out_of_stock')}
              </Text>
            )}
          </View>

          {/* Quantity Controls */}
          <View className="mb-2 flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => decrementQuantity(product.id)}
              disabled={isUpdating || isRemoving}
              className="h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 disabled:opacity-50"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#6b7280" />
              ) : (
                <Minus size={16} className="text-neutral-800 dark:text-neutral-200" />
              )}
            </TouchableOpacity>

            <Text className="min-w-[32px] text-center text-base font-semibold">
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => incrementQuantity(product.id)}
              disabled={product.stock <= 0 || quantity >= product.stock || isUpdating || isRemoving}
              className="h-8 w-8 items-center justify-center rounded-full bg-primary-600 disabled:opacity-50"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Plus size={16} className="text-white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Total for this item */}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-base font-bold text-primary-600">
              ₲{totalItemPrice.toLocaleString('es-PY')}
            </Text>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => removeFromCart(product.id, product)}
              disabled={isRemoving || isUpdating}
              className="flex-row items-center gap-1 disabled:opacity-50"
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <>
                  <Trash2 size={16} color="#EF4444" />
                  <Text className="text-sm text-red-500 dark:text-red-400">{t('cart.remove')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

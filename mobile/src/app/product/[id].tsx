import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useProduct } from '@/api/products';
import { Button, Text, View } from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';
import { Heart } from '@/components/ui/icons';
import { useCartSync } from '@/lib/cart';
import { useWishlistSync } from '@/lib/wishlist';
import { getProductImageUrl, getImageUrl } from '@/lib/image-utils';

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct({ variables: { id: id! } });

  const { addToCart, isAdding } = useCartSync();
  const { toggleWishlist, isInWishlist } = useWishlistSync();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-neutral-600">{t('product.loading')}</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-lg text-neutral-900 dark:text-white">
          {t('product.not_found')}
        </Text>
        <Button label={t('common.go_back')} onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images?.[selectedImageIndex]
    ? getImageUrl(product.images[selectedImageIndex].url || product.images[selectedImageIndex].filename)
    : getProductImageUrl(product);
  const hasStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!hasStock) {
      Alert.alert(t('cart.out_of_stock'), t('product.unavailable'));
      return;
    }
    addToCart(product as any, quantity);
    Alert.alert(t('common.success'), `${product.name} ${t('product.added_to_cart')}`, [
      { text: t('product.continue_shopping'), style: 'cancel' },
      { text: t('product.view_cart'), onPress: () => router.push('/cart') },
    ]);
  };

  const handleBuyNow = () => {
    if (!hasStock) {
      Alert.alert(t('cart.out_of_stock'), t('product.unavailable'));
      return;
    }
    addToCart(product as any, quantity);
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1">
        {/* Product Images */}
        <View className="relative bg-neutral-100 dark:bg-neutral-800">
          {/* Main Image */}
          <Image
            source={{ uri: mainImage }}
            className="h-96 w-full"
            contentFit="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 top-4 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-neutral-800"
          >
            <ChevronLeft size={24} color="#059669" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Wishlist Button */}
          <TouchableOpacity
            onPress={handleToggleWishlist}
            className="absolute right-4 top-4 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-neutral-800"
          >
            <Heart
              width={24}
              height={24}
              color={inWishlist ? '#ef4444' : '#6b7280'}
              fill={inWishlist ? '#ef4444' : 'none'}
            />
          </TouchableOpacity>

          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="absolute bottom-4 left-0 right-0 px-4"
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={image.id}
                  onPress={() => setSelectedImageIndex(index)}
                  className={`mr-2 h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    selectedImageIndex === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    source={{ uri: getImageUrl(image.url || image.filename) }}
                    className="h-full w-full"
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View className="p-4">
          {/* Brand */}
          {product.brand && (
            <Text className="mb-2 text-sm font-semibold text-primary-600">
              {product.brand.name}
            </Text>
          )}

          {/* Name */}
          <Text className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
            {product.name}
          </Text>

          {/* Category */}
          {product.category && (
            <Text className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
              {t('product.category')}: {product.category.name}
            </Text>
          )}

          {/* Price */}
          <View className="mb-4 flex-row items-center">
            <Text className="text-3xl font-bold text-primary-600">
              ₲{product.price?.toLocaleString('es-PY')}
            </Text>
            {product.price && product.price > 0 && (
              <View className="ml-3">
                <Text className="text-lg text-neutral-500 line-through dark:text-neutral-400">
                  ₲{Math.round(Number(product.price) * 1.1).toLocaleString('es-PY')}
                </Text>
              </View>
            )}
          </View>

          {/* Stock Status */}
          <View className="mb-6">
            {hasStock ? (
              <View className="flex-row items-center">
                <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                <Text className="text-green-600 dark:text-green-500">
                  {t('product.in_stock')} ({product.stock} {t('product.available')})
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <View className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                <Text className="text-red-600 dark:text-red-500">{t('cart.out_of_stock')}</Text>
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          {hasStock && (
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
                {t('product.quantity')}:
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 items-center justify-center rounded-lg border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800"
                >
                  <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                    −
                  </Text>
                </TouchableOpacity>
                <Text className="mx-6 text-xl font-bold text-neutral-900 dark:text-white">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-12 w-12 items-center justify-center rounded-lg border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800"
                >
                  <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="mb-6 gap-3">
            <Button
              label={isAdding ? `${t('common.loading')}...` : t('product.add_to_cart')}
              onPress={handleAddToCart}
              disabled={!hasStock || isAdding}
              loading={isAdding}
              variant={hasStock ? 'default' : 'outline'}
            />
            <Button
              label={t('product.buy_now')}
              variant="secondary"
              onPress={handleBuyNow}
              disabled={!hasStock || isAdding}
            />
          </View>

          {/* Description */}
          {product.description && (
            <View className="mb-6">
              <Text className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                {t('product.description')}
              </Text>
              <Text className="text-base leading-6 text-neutral-700 dark:text-neutral-300">
                {product.description}
              </Text>
            </View>
          )}

          {/* Specifications */}
          {product.specifications && (
            <View className="mb-6">
              <Text className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                {t('product.specifications')}
              </Text>
              <Text className="text-base leading-6 text-neutral-700 dark:text-neutral-300">
                {product.specifications}
              </Text>
            </View>
          )}

          {/* Details */}
          {product.details && (
            <View className="mb-6">
              <Text className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                {t('product.details')}
              </Text>
              <Text className="text-base leading-6 text-neutral-700 dark:text-neutral-300">
                {product.details}
              </Text>
            </View>
          )}

          {/* Reference ID */}
          {product.referenceId && (
            <View className="mb-6">
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('product.sku')}: {product.referenceId}
              </Text>
            </View>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View className="mb-6">
              <Text className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
                {t('product.tags')}:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800"
                  >
                    <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

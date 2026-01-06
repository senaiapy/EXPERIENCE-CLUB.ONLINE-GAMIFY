import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';

import { useWishlistSync } from '@/lib/wishlist';
import { getProductImageUrl } from '@/lib/image-utils';
import type { Product } from '@/api/products';

import { Text, View } from './index';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlistSync();

  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    toggleWishlist(product as any);
  };

  // Use centralized image utility function
  // Images are served from backend at IMAGE_BASE_URL
  const imageUrl = getProductImageUrl(product);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 w-full overflow-hidden rounded-xl bg-white dark:bg-neutral-800"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* Image */}
      <View className="relative h-44 w-full bg-neutral-50 dark:bg-neutral-700">
        <Image source={{ uri: imageUrl }} className="h-full w-full" contentFit="cover" />
        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={handleToggleWishlist}
          disabled={isLoading}
          className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-white/90 disabled:opacity-70"
          style={{ elevation: 2 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#D17842" />
          ) : (
            <Heart
              size={16}
              color={inWishlist ? '#D17842' : '#666'}
              fill={inWishlist ? '#D17842' : 'none'}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-2.5">
        {/* Brand Name */}
        {product.brand?.name && (
          <Text numberOfLines={1} className="mb-1 text-[10px] uppercase text-neutral-400">
            {product.brand.name}
          </Text>
        )}

        {/* Product Name - 2 lines in black with smaller text */}
        <Text numberOfLines={2} className="mb-1.5 min-h-[32px] text-[11px] font-semibold leading-tight text-black dark:text-white">
          {product.name}
        </Text>

        {/* Stock Status */}
        <View className="mb-1.5 flex-row items-center">
          {product.stock > 0 ? (
            <>
              <View className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
              <Text className="text-[10px] text-green-600">In Stock</Text>
            </>
          ) : (
            <>
              <View className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              <Text className="text-[10px] text-red-600">Out of Stock</Text>
            </>
          )}
        </View>

        {/* Price Section */}
        <View>
          {/* Original Price (price + 10%, strikethrough) */}
          {product.price && Number(product.price) > 0 && (
            <Text className="text-[10px] text-neutral-400 line-through">
              ₲{Math.round(Number(product.price) * 1.1).toLocaleString('es-PY')}
            </Text>
          )}
          {/* Current Price */}
          <Text className="text-base font-bold text-primary-600">
            ₲{product.price?.toLocaleString('es-PY') || '0'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

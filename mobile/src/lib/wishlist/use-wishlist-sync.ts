import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import type { Product } from '@/api/products/types';
import { useAddToWishlist, useRemoveFromWishlist } from '@/api/wishlist';

import { useWishlist } from './index';

/**
 * Hook for synchronized wishlist operations with backend API
 * Implements optimistic updates with automatic rollback on error
 */
export const useWishlistSync = () => {
  const queryClient = useQueryClient();

  // Local wishlist actions
  const addToWishlistLocal = useWishlist.use.addToWishlist();
  const removeFromWishlistLocal = useWishlist.use.removeFromWishlist();
  const isInWishlistLocal = useWishlist.use.isInWishlist();

  // API mutations
  const { mutate: addToWishlistApi, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlistApi, isPending: isRemoving } =
    useRemoveFromWishlist();

  /**
   * Add product to wishlist with optimistic update
   */
  const addToWishlist = (
    product: Product,
    showSuccessMessage: boolean = true
  ) => {
    // Check if already in wishlist
    if (isInWishlistLocal(product.id)) {
      return;
    }

    // Optimistic update (instant UI feedback)
    addToWishlistLocal(product);

    // Sync with backend
    addToWishlistApi(
      { productId: product.id },
      {
        onError: (error: any) => {
          // Rollback optimistic update
          removeFromWishlistLocal(product.id);

          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to add to wishlist'
          );
        },
        onSuccess: () => {
          // Invalidate wishlist query to refetch from backend
          queryClient.invalidateQueries({ queryKey: ['wishlist'] });

          if (showSuccessMessage) {
            Alert.alert('Success', `${product.name} added to wishlist`);
          }
        },
      }
    );
  };

  /**
   * Remove product from wishlist with optimistic update
   */
  const removeFromWishlist = (productId: string, product?: Product) => {
    // Store wishlist for rollback
    const wishlist = useWishlist.getState().items;
    const removedProduct = wishlist.find((item) => item.id === productId);

    // Optimistic update
    removeFromWishlistLocal(productId);

    // Sync with backend
    removeFromWishlistApi(
      { productId },
      {
        onError: (error: any) => {
          // Rollback by re-adding
          if (removedProduct) {
            addToWishlistLocal(removedProduct);
          }

          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to remove from wishlist'
          );
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
      }
    );
  };

  /**
   * Toggle product in wishlist (smart add/remove)
   */
  const toggleWishlist = (product: Product) => {
    const inWishlist = isInWishlistLocal(product.id);

    if (inWishlist) {
      removeFromWishlist(product.id, product);
    } else {
      addToWishlist(product, false); // Don't show success message for toggle
    }
  };

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = (productId: string) => {
    return isInWishlistLocal(productId);
  };

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isLoading: isAdding || isRemoving,
    isAdding,
    isRemoving,
  };
};

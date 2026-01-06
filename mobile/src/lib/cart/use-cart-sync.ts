import { useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { useAddToCart, useRemoveFromCart, useUpdateCart } from '@/api/cart';
import type { Product } from '@/api/products/types';

import { useCart } from './index';

/**
 * Hook for synchronized cart operations with backend API
 * Implements optimistic updates with automatic rollback on error
 */
export const useCartSync = () => {
  const queryClient = useQueryClient();

  // Local cart actions
  const addToCartLocal = useCart.use.addToCart();
  const updateQuantityLocal = useCart.use.updateQuantity();
  const removeFromCartLocal = useCart.use.removeFromCart();
  const getItemQuantity = useCart.use.getItemQuantity();

  // API mutations
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCart();
  const { mutate: updateCartApi, isPending: isUpdating } = useUpdateCart();
  const { mutate: removeFromCartApi, isPending: isRemoving } =
    useRemoveFromCart();

  /**
   * Add product to cart with optimistic update
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    // Store previous quantity for rollback
    const previousQuantity = getItemQuantity(product.id);

    // Optimistic update (instant UI feedback)
    addToCartLocal(product, quantity);

    // Sync with backend
    addToCartApi(
      { productId: product.id, quantity },
      {
        onError: (error: any) => {
          // Rollback optimistic update
          if (previousQuantity > 0) {
            updateQuantityLocal(product.id, previousQuantity);
          } else {
            removeFromCartLocal(product.id);
          }

          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to add item to cart'
          );
        },
        onSuccess: () => {
          // Invalidate cart query to refetch from backend
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
      }
    );
  };

  /**
   * Update item quantity with optimistic update
   */
  const updateQuantity = (productId: string, quantity: number) => {
    // Store previous quantity for rollback
    const previousQuantity = getItemQuantity(productId);

    // Optimistic update
    updateQuantityLocal(productId, quantity);

    // Sync with backend
    updateCartApi(
      { productId, data: { quantity } },
      {
        onError: (error: any) => {
          // Rollback
          updateQuantityLocal(productId, previousQuantity);

          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to update quantity'
          );
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
      }
    );
  };

  /**
   * Increment quantity by 1
   */
  const incrementQuantity = (productId: string) => {
    const currentQuantity = getItemQuantity(productId);
    updateQuantity(productId, currentQuantity + 1);
  };

  /**
   * Decrement quantity by 1
   */
  const decrementQuantity = (productId: string) => {
    const currentQuantity = getItemQuantity(productId);
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  /**
   * Remove item from cart with optimistic update
   */
  const removeFromCart = (productId: string, product?: Product) => {
    // Store cart list for rollback
    const cartList = useCart.getState().cartList;
    const removedItem = cartList.find((item) => item.product.id === productId);

    // Optimistic update
    removeFromCartLocal(productId);

    // Sync with backend
    removeFromCartApi(
      { productId },
      {
        onError: (error: any) => {
          // Rollback by re-adding the item
          if (removedItem) {
            addToCartLocal(removedItem.product, removedItem.quantity);
          }

          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to remove item'
          );
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
      }
    );
  };

  return {
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    isLoading: isAdding || isUpdating || isRemoving,
    isAdding,
    isUpdating,
    isRemoving,
  };
};

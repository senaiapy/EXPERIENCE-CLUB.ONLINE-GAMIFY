import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import type { Product } from '@/api/products/types';

import { storage } from '../storage';
import { createSelectors } from '../utils';

// Wrapper to make MMKV compatible with Zustand's StateStorage
const zustandStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartList: CartItem[];
  totalPrice: number;
  totalItems: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  syncWithBackend: (items: CartItem[]) => void;
}

const calculateTotals = (cartList: CartItem[]) => {
  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce((sum, item) => {
    const price = item.product.price_sale || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  return { totalItems, totalPrice };
};

const _useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartList: [],
      totalPrice: 0,
      totalItems: 0,

      addToCart: (product, quantity = 1) => {
        const { cartList } = get();
        const existingItemIndex = cartList.findIndex(
          (item) => item.product.id === product.id
        );

        let newCartList: CartItem[];
        if (existingItemIndex > -1) {
          // Update existing item
          newCartList = [...cartList];
          newCartList[existingItemIndex] = {
            ...newCartList[existingItemIndex],
            quantity: newCartList[existingItemIndex].quantity + quantity,
          };
        } else {
          // Add new item
          newCartList = [...cartList, { product, quantity }];
        }

        const totals = calculateTotals(newCartList);
        set({
          cartList: newCartList,
          ...totals,
        });
      },

      removeFromCart: (productId) => {
        const { cartList } = get();
        const newCartList = cartList.filter(
          (item) => item.product.id !== productId
        );
        const totals = calculateTotals(newCartList);
        set({
          cartList: newCartList,
          ...totals,
        });
      },

      updateQuantity: (productId, quantity) => {
        const { cartList } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const newCartList = cartList.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(newCartList);
        set({
          cartList: newCartList,
          ...totals,
        });
      },

      incrementQuantity: (productId) => {
        const { cartList } = get();
        const item = cartList.find((i) => i.product.id === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      decrementQuantity: (productId) => {
        const { cartList } = get();
        const item = cartList.find((i) => i.product.id === productId);
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1);
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId);
        }
      },

      clearCart: () => {
        set({
          cartList: [],
          totalPrice: 0,
          totalItems: 0,
        });
      },

      isInCart: (productId) => {
        return get().cartList.some((item) => item.product.id === productId);
      },

      getItemQuantity: (productId) => {
        const item = get().cartList.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      },

      syncWithBackend: (items) => {
        const totals = calculateTotals(items);
        set({
          cartList: items,
          ...totals,
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const useCart = createSelectors(_useCart);
export const addToCart = (product: Product, quantity?: number) =>
  _useCart.getState().addToCart(product, quantity);
export const removeFromCart = (productId: string) =>
  _useCart.getState().removeFromCart(productId);
export const clearCart = () => _useCart.getState().clearCart();
export const syncCartWithBackend = (items: CartItem[]) =>
  _useCart.getState().syncWithBackend(items);

// Export sync hook for API-backed cart operations
export { useCartSync } from './use-cart-sync';

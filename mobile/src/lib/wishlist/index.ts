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

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  syncWithBackend: (items: Product[]) => void;
}

const _useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);
        if (!existingItem) {
          set({ items: [...items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      toggleWishlist: (product) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.id === product.id
        );
        if (existingItemIndex >= 0) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      syncWithBackend: (items) => {
        set({ items });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const useWishlist = createSelectors(_useWishlist);
export const addToWishlist = (product: Product) =>
  _useWishlist.getState().addToWishlist(product);
export const removeFromWishlist = (productId: string) =>
  _useWishlist.getState().removeFromWishlist(productId);
export const toggleWishlist = (product: Product) =>
  _useWishlist.getState().toggleWishlist(product);
export const syncWishlistWithBackend = (items: Product[]) =>
  _useWishlist.getState().syncWithBackend(items);

// Export sync hook for API-backed wishlist operations
export { useWishlistSync } from './use-wishlist-sync';

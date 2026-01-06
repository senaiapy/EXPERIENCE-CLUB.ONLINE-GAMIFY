import type { Product } from '../products/types';

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToWishlistDto {
  productId: string;
}

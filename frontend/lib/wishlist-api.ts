import { api } from './axios';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image_name?: string;
    brand_name?: string;
    images?: Array<{
      id: string;
      filename: string;
      url: string;
    }>;
    brand?: {
      id: string;
      name: string;
    };
  };
}

export interface Wishlist {
  items: WishlistItem[];
  count: number;
}

export interface AddToWishlistDto {
  productId: string;
}

// Wishlist API service
export const wishlistApi = {
  // Get user wishlist
  async getWishlist(): Promise<Wishlist> {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  async addToWishlist(data: AddToWishlistDto): Promise<Wishlist> {
    const response = await api.post('/wishlist', data);
    return response.data;
  },

  // Check if product is in wishlist
  async isInWishlist(productId: string): Promise<{ isInWishlist: boolean }> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Clear wishlist
  async clearWishlist(): Promise<{ message: string }> {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};
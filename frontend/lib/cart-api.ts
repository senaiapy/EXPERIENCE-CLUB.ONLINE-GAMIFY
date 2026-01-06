import { api } from './axios';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    price_sale?: number;
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

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Cart API service
export const cartApi = {
  // Get user cart
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  async addToCart(data: AddToCartDto): Promise<Cart> {
    const response = await api.post('/cart', data);
    return response.data;
  },

  // Update cart item quantity
  async updateItem(productId: string, data: UpdateCartItemDto): Promise<Cart> {
    const response = await api.patch(`/cart/${productId}`, data);
    return response.data;
  },

  // Remove item from cart
  async removeItem(productId: string): Promise<Cart> {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  // Clear cart
  async clearCart(): Promise<Cart> {
    const response = await api.delete('/cart');
    return response.data;
  },
};
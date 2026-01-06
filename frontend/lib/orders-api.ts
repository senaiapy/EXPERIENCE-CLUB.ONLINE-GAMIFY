import { api } from './axios';

export interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COINS' | 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  postalCode?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_name?: string;
    images?: Array<{
      id: string;
      filename: string;
      url: string;
    }>;
  };
}

export interface OrdersResponse {
  orders: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
}

export interface UpdateOrderDto {
  status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
}

export interface CreateOrderDto {
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  postalCode?: string;
  phone: string;
  paymentMethod: 'COINS' | 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';
  shippingCost?: number;
  tax?: number;
  notes?: string;
}

// Orders API service
export const ordersApi = {
  // Create a new order from cart (Checkout)
  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Get current user's orders
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    // Backend returns { orders: [], meta: {} }
    return response.data.orders || [];
  },

  // Get all orders (Admin only)
  async getAll(params?: OrderQueryParams): Promise<OrdersResponse> {
    const response = await api.get('/orders/all', { params });
    return response.data;
  },

  // Get order statistics (Admin only)
  async getStats(): Promise<OrderStats> {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Get single order by ID
  async getById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (Admin only)
  async update(id: string, data: UpdateOrderDto): Promise<Order> {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },
};
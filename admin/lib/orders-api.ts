import { api } from './axios';

export interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';
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
    ref?: string;
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

// Orders API service
export const ordersApi = {
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
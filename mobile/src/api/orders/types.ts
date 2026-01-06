import type { Product } from '../products/types';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COINS' | 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'OTHER';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number; // Price at time of order
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  postalCode?: string;
  phone: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  postalCode?: string;
  phone: string;
  paymentMethod: PaymentMethod;
  shippingCost?: number;
  tax?: number;
  notes?: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

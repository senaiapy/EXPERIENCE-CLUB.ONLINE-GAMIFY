/**
 * useFacebookPixel Hook
 *
 * Custom React hook for easy Facebook Pixel event tracking
 */

import {
  trackViewContent,
  trackAddToCart,
  trackAddToWishlist,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  trackSearch,
  trackCompleteRegistration,
  trackLead,
  trackCustomEvent
} from '@/lib/facebook-pixel';

export const useFacebookPixel = () => {
  return {
    // Track when user views a product
    trackProductView: (product: {
      id: string;
      name: string;
      price: number;
      category?: string;
    }) => {
      trackViewContent({
        contentName: product.name,
        contentId: product.id,
        contentType: 'product',
        contentCategory: product.category,
        value: product.price,
        currency: 'PYG'
      });
    },

    // Track when user adds to cart
    trackCartAdd: (product: {
      id: string;
      name: string;
      price: number;
      quantity?: number;
    }) => {
      trackAddToCart({
        contentName: product.name,
        contentId: product.id,
        value: product.price * (product.quantity || 1),
        currency: 'PYG',
        quantity: product.quantity || 1
      });
    },

    // Track when user adds to wishlist
    trackWishlistAdd: (product: {
      id: string;
      name: string;
      price: number;
    }) => {
      trackAddToWishlist({
        contentName: product.name,
        contentId: product.id,
        value: product.price,
        currency: 'PYG'
      });
    },

    // Track when user starts checkout
    trackCheckoutStart: (cart: {
      total: number;
      itemCount: number;
      productIds: string[];
    }) => {
      trackInitiateCheckout({
        value: cart.total,
        currency: 'PYG',
        numItems: cart.itemCount,
        contentIds: cart.productIds
      });
    },

    // Track when user adds payment info
    trackPaymentInfo: (checkout: {
      total: number;
      productIds: string[];
    }) => {
      trackAddPaymentInfo({
        value: checkout.total,
        currency: 'PYG',
        contentIds: checkout.productIds
      });
    },

    // Track completed purchase
    trackOrderComplete: (order: {
      id: string;
      total: number;
      itemCount: number;
      items: Array<{
        id: string;
        quantity: number;
        price: number;
      }>;
    }) => {
      trackPurchase({
        value: order.total,
        currency: 'PYG',
        orderId: order.id,
        numItems: order.itemCount,
        contentIds: order.items.map(item => item.id),
        contents: order.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          item_price: item.price
        }))
      });
    },

    // Track product search
    trackProductSearch: (searchQuery: string, category?: string) => {
      trackSearch({
        searchString: searchQuery,
        contentCategory: category
      });
    },

    // Track user registration
    trackUserRegistration: () => {
      trackCompleteRegistration({
        status: 'completed'
      });
    },

    // Track contact form submission
    trackContactForm: (formName?: string) => {
      trackLead({
        contentName: formName || 'Contact Form'
      });
    },

    // Track custom events
    trackCustom: (eventName: string, data?: Record<string, any>) => {
      trackCustomEvent(eventName, data);
    }
  };
};

export default useFacebookPixel;

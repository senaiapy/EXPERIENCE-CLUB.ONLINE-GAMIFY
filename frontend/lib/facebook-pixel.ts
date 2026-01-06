/**
 * Facebook Pixel Integration
 *
 * This module provides functions to send events to Facebook Pixel API
 * for tracking user actions, conversions, and analytics.
 */

// Facebook Pixel ID - Replace with your actual Pixel ID
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

// Type definitions for Facebook Pixel events
export interface FacebookPixelEvent {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  user_data?: {
    em?: string; // Email (hashed)
    ph?: string; // Phone (hashed)
    fn?: string; // First name (hashed)
    ln?: string; // Last name (hashed)
    ct?: string; // City (hashed)
    st?: string; // State (hashed)
    zp?: string; // Zip code (hashed)
    country?: string; // Country code
    external_id?: string; // User ID
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{
      id: string;
      quantity: number;
      item_price?: number;
    }>;
    content_type?: string;
    num_items?: number;
    search_string?: string;
    status?: string;
  };
}

/**
 * Initialize Facebook Pixel
 * Call this once when the app loads
 */
export const initFacebookPixel = (): void => {
  if (typeof window === 'undefined' || !FB_PIXEL_ID) return;

  // Check if Facebook Pixel is already loaded
  if (window.fbq) return;

  // Load Facebook Pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" />`;
  document.body.appendChild(noscript);
};

/**
 * Track a page view
 */
export const trackPageView = (): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track ViewContent event - User viewed a product
 */
export const trackViewContent = (params: {
  contentName: string;
  contentId: string;
  contentType?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: params.contentName,
      content_ids: [params.contentId],
      content_type: params.contentType || 'product',
      content_category: params.contentCategory,
      value: params.value,
      currency: params.currency || 'PYG'
    });
  }
};

/**
 * Track AddToCart event - User added item to cart
 */
export const trackAddToCart = (params: {
  contentName: string;
  contentId: string;
  contentType?: string;
  value: number;
  currency?: string;
  quantity?: number;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: params.contentName,
      content_ids: [params.contentId],
      content_type: params.contentType || 'product',
      value: params.value,
      currency: params.currency || 'PYG',
      contents: [{
        id: params.contentId,
        quantity: params.quantity || 1
      }]
    });
  }
};

/**
 * Track AddToWishlist event - User added item to wishlist
 */
export const trackAddToWishlist = (params: {
  contentName: string;
  contentId: string;
  value: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToWishlist', {
      content_name: params.contentName,
      content_ids: [params.contentId],
      value: params.value,
      currency: params.currency || 'PYG'
    });
  }
};

/**
 * Track InitiateCheckout event - User started checkout process
 */
export const trackInitiateCheckout = (params: {
  value: number;
  currency?: string;
  numItems: number;
  contentIds: string[];
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: params.value,
      currency: params.currency || 'PYG',
      num_items: params.numItems,
      content_ids: params.contentIds
    });
  }
};

/**
 * Track AddPaymentInfo event - User added payment info
 */
export const trackAddPaymentInfo = (params: {
  value: number;
  currency?: string;
  contentIds: string[];
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: params.value,
      currency: params.currency || 'PYG',
      content_ids: params.contentIds
    });
  }
};

/**
 * Track Purchase event - User completed a purchase
 */
export const trackPurchase = (params: {
  value: number;
  currency?: string;
  orderId: string;
  numItems: number;
  contentIds: string[];
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: params.value,
      currency: params.currency || 'PYG',
      content_ids: params.contentIds,
      num_items: params.numItems,
      contents: params.contents,
      content_type: 'product',
      // Custom parameter for order tracking
      order_id: params.orderId
    });
  }
};

/**
 * Track Search event - User searched for products
 */
export const trackSearch = (params: {
  searchString: string;
  contentCategory?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: params.searchString,
      content_category: params.contentCategory
    });
  }
};

/**
 * Track CompleteRegistration event - User completed registration
 */
export const trackCompleteRegistration = (params?: {
  status?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      status: params?.status || 'completed',
      value: params?.value,
      currency: params?.currency || 'PYG'
    });
  }
};

/**
 * Track Lead event - User submitted a contact form
 */
export const trackLead = (params?: {
  contentName?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: params?.contentName,
      value: params?.value,
      currency: params?.currency || 'PYG'
    });
  }
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
};

/**
 * Send event to Facebook Conversion API (Server-Side)
 * This should be called from your backend API
 */
export const sendConversionAPIEvent = async (event: FacebookPixelEvent): Promise<void> => {
  try {
    // This should call your backend API endpoint that forwards to Facebook
    const response = await fetch('/api/facebook-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      console.error('Failed to send Facebook Conversion API event:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Facebook Conversion API event:', error);
  }
};

// Type definitions for window.fbq
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: Record<string, any>
    ) => void;
    _fbq?: any;
  }
}

export default {
  init: initFacebookPixel,
  pageView: trackPageView,
  viewContent: trackViewContent,
  addToCart: trackAddToCart,
  addToWishlist: trackAddToWishlist,
  initiateCheckout: trackInitiateCheckout,
  addPaymentInfo: trackAddPaymentInfo,
  purchase: trackPurchase,
  search: trackSearch,
  completeRegistration: trackCompleteRegistration,
  lead: trackLead,
  custom: trackCustomEvent,
  conversionAPI: sendConversionAPIEvent
};

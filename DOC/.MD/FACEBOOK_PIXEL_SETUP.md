# Facebook Pixel Integration Guide

Complete guide for integrating Facebook Pixel tracking in the Experience Club frontend.

## Setup Instructions

### 1. Add Your Facebook Pixel ID

Add your Facebook Pixel ID to the `.env.local` file:

```bash
# frontend/.env.local
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id_here
```

### 2. Initialize Facebook Pixel in Root Layout

Add the `FacebookPixel` component to your root layout to enable automatic page view tracking:

**File: `app/layout.tsx`**

```tsx
import FacebookPixel from '@/components/FacebookPixel';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
```

## Usage Examples

### Option 1: Using the Hook (Recommended)

The easiest way to track events in your components:

```tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function ProductPage({ product }) {
  const fb = useFacebookPixel();

  useEffect(() => {
    // Track product view
    fb.trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category
    });
  }, [product]);

  const handleAddToCart = () => {
    // Track add to cart
    fb.trackCartAdd({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Option 2: Direct Function Calls

Import and call tracking functions directly:

```tsx
import { trackAddToCart } from '@/lib/facebook-pixel';

const handleAddToCart = () => {
  trackAddToCart({
    contentName: 'Product Name',
    contentId: 'prod_123',
    value: 50000,
    currency: 'PYG',
    quantity: 1
  });
};
```

## Available Events

### 1. Page View
Automatically tracked when `FacebookPixel` component is added to layout.

### 2. View Content (Product View)
```tsx
fb.trackProductView({
  id: 'prod_123',
  name: 'Product Name',
  price: 250000,
  category: 'Perfumes'
});
```

### 3. Add to Cart
```tsx
fb.trackCartAdd({
  id: 'prod_123',
  name: 'Product Name',
  price: 250000,
  quantity: 1
});
```

### 4. Add to Wishlist
```tsx
fb.trackWishlistAdd({
  id: 'prod_123',
  name: 'Product Name',
  price: 250000
});
```

### 5. Initiate Checkout
```tsx
fb.trackCheckoutStart({
  total: 750000,
  itemCount: 3,
  productIds: ['prod_123', 'prod_456', 'prod_789']
});
```

### 6. Add Payment Info
```tsx
fb.trackPaymentInfo({
  total: 750000,
  productIds: ['prod_123', 'prod_456']
});
```

### 7. Purchase (Order Completed)
```tsx
fb.trackOrderComplete({
  id: 'order_abc123',
  total: 750000,
  itemCount: 3,
  items: [
    { id: 'prod_123', quantity: 1, price: 250000 },
    { id: 'prod_456', quantity: 2, price: 250000 }
  ]
});
```

### 8. Search
```tsx
fb.trackProductSearch('perfume arabico', 'Perfumes');
```

### 9. Complete Registration
```tsx
fb.trackUserRegistration();
```

### 10. Lead (Contact Form)
```tsx
fb.trackContactForm('Newsletter Signup');
```

### 11. Custom Events
```tsx
fb.trackCustom('CustomEventName', {
  custom_param: 'value'
});
```

## Integration Points

### Product Card Component
```tsx
// components/ProductCard.tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function ProductCard({ product }) {
  const fb = useFacebookPixel();

  const handleAddToCart = async () => {
    // Your cart logic here
    await cartApi.addToCart({ productId: product.id, quantity: 1 });

    // Track the event
    fb.trackCartAdd({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <div onClick={() => fb.trackProductView(product)}>
      {/* Product card content */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Product Detail Page
```tsx
// app/product/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function ProductDetailPage({ product }) {
  const fb = useFacebookPixel();

  useEffect(() => {
    // Track product view when page loads
    fb.trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category
    });
  }, [product]);

  return <div>{/* Product details */}</div>;
}
```

### Cart Page
```tsx
// app/cart/page.tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function CartPage({ cart }) {
  const fb = useFacebookPixel();

  const handleCheckout = () => {
    // Track checkout initiation
    fb.trackCheckoutStart({
      total: cart.total,
      itemCount: cart.items.length,
      productIds: cart.items.map(item => item.productId)
    });

    // Navigate to checkout
    router.push('/checkout');
  };

  return (
    <button onClick={handleCheckout}>
      Proceed to Checkout
    </button>
  );
}
```

### Checkout Page
```tsx
// app/checkout/page.tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function CheckoutPage({ cart }) {
  const fb = useFacebookPixel();

  const handlePaymentMethodSelect = (method: string) => {
    // Track when user adds payment info
    fb.trackPaymentInfo({
      total: cart.total,
      productIds: cart.items.map(item => item.productId)
    });
  };

  return <div>{/* Checkout form */}</div>;
}
```

### Order Confirmation Page
```tsx
// app/order-confirmation/page.tsx
'use client';

import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function OrderConfirmationPage({ order }) {
  const fb = useFacebookPixel();

  useEffect(() => {
    if (order) {
      // Track completed purchase
      fb.trackOrderComplete({
        id: order.id,
        total: order.total,
        itemCount: order.items.length,
        items: order.items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
  }, [order]);

  return <div>{/* Order confirmation */}</div>;
}
```

### Registration Page
```tsx
// app/auth/register/page.tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function RegisterPage() {
  const fb = useFacebookPixel();

  const handleRegister = async (data) => {
    await authApi.register(data);

    // Track registration completion
    fb.trackUserRegistration();

    router.push('/');
  };

  return <form onSubmit={handleRegister}>{/* Form fields */}</form>;
}
```

### Search Page
```tsx
// app/search/page.tsx
'use client';

import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function SearchPage({ searchParams }) {
  const fb = useFacebookPixel();

  useEffect(() => {
    if (searchParams.q) {
      // Track search
      fb.trackProductSearch(searchParams.q, searchParams.category);
    }
  }, [searchParams]);

  return <div>{/* Search results */}</div>;
}
```

### Wishlist Page
```tsx
// app/wishlist/page.tsx
'use client';

import { useFacebookPixel } from '@/hooks/useFacebookPixel';

export default function WishlistPage() {
  const fb = useFacebookPixel();

  const handleAddToWishlist = async (product) => {
    await wishlistApi.add(product.id);

    // Track wishlist addition
    fb.trackWishlistAdd({
      id: product.id,
      name: product.name,
      price: product.price
    });
  };

  return <div>{/* Wishlist items */}</div>;
}
```

## Testing

### 1. Install Facebook Pixel Helper Extension
- Chrome: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- This extension shows which pixels are firing on your page

### 2. Test Events Manager
- Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
- Select your Pixel
- Go to "Test Events" tab
- Events should appear in real-time as you trigger them

### 3. Debug Mode
Enable debug mode by adding to console:
```javascript
window.fbq && window.fbq('set', 'debug', true);
```

## Currency Conversion

All prices are tracked in **Guaraníes (PYG)** as that's the native currency. Facebook will automatically convert to your account's currency for reporting.

```tsx
// Prices are already in Guaraníes
fb.trackCartAdd({
  contentId: 'prod_123',
  contentName: 'Product',
  value: 250000, // 250,000 Guaraníes
  currency: 'PYG' // Important: specify currency
});
```

## Best Practices

1. **Always include currency**: Set `currency: 'PYG'` for all value-based events
2. **Use consistent IDs**: Use the same product IDs across all events
3. **Track all key events**: PageView, ViewContent, AddToCart, Purchase are minimum
4. **Test thoroughly**: Use Facebook Pixel Helper before going live
5. **Avoid duplicate events**: Only track each event once per action
6. **Use Server-Side API**: For critical events like Purchase, also send via Conversion API

## Troubleshooting

### Events not showing in Facebook
- Check that `NEXT_PUBLIC_FB_PIXEL_ID` is set correctly
- Verify Pixel is initialized (check browser console for `fbq` object)
- Use Facebook Pixel Helper to debug
- Check browser console for errors

### Duplicate events
- Make sure you're not calling tracking functions multiple times
- Check useEffect dependencies

### Wrong currency
- Always set `currency: 'PYG'` in all tracking calls
- Don't use USD values

## Additional Resources

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Standard Events](https://developers.facebook.com/docs/meta-pixel/reference)
- [Conversion API](https://developers.facebook.com/docs/marketing-api/conversions-api)

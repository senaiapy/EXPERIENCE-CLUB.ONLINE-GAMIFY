# Facebook Pixel - Quick Setup Guide

## ✅ Setup Complete!

Your Facebook Pixel is now configured and ready to track events on your Experience Club frontend.

### Configuration Details

- **Pixel ID**: `3599167170310984`
- **Environment**: Development (localhost)
- **Location**: `frontend/.env`

---

## 🚀 Running the Frontend for Testing

### Option 1: Run Frontend Only (Non-Docker)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Run frontend development server
npm run dev
```

The frontend will be available at: **http://localhost:3060**

### Option 2: Run All Services with Docker

```bash
# From root directory
npm run dev:start

# View logs
npm run dev:logs
```

---

## 🧪 Testing Facebook Pixel

### 1. Install Facebook Pixel Helper (Chrome Extension)

Install the extension to see pixel events in real-time:
- [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

### 2. Test Automatic Page View Tracking

1. Start the frontend: `npm run dev` (in frontend directory)
2. Open browser to: http://localhost:3060
3. Open Facebook Pixel Helper extension
4. You should see a green checkmark with **PageView** event

### 3. Test Product View Events

```bash
# Navigate to any product page
# Example: http://localhost:3060/product/[product-id]
```

**Expected Events:**
- ✅ `PageView` - Automatic on every page
- ✅ `ViewContent` - When viewing a product (if implemented)

### 4. Test Add to Cart Events

Click "Agregar al Carrito" on any product.

**Expected Event:**
- ✅ `AddToCart` - With product details

### 5. Test Purchase Events

Complete a purchase flow:

1. Add items to cart
2. Go to checkout: http://localhost:3060/checkout
3. Complete order
4. View confirmation page

**Expected Events:**
- ✅ `InitiateCheckout` - When starting checkout
- ✅ `AddPaymentInfo` - When adding payment details
- ✅ `Purchase` - On order confirmation

---

## 📊 View Events in Facebook Events Manager

### Real-Time Event Testing

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel (3599167170310984)
3. Click **Test Events** tab
4. Use your site - events will appear in real-time!

### Expected Data

Each event should show:
- Event Name
- Currency: **PYG** (Guaraníes)
- Value: Product prices in Guaraníes
- Content IDs: Product IDs
- Timestamp

---

## 🔧 Implementation Status

### ✅ Completed

- [x] Facebook Pixel library created
- [x] FacebookPixel component added to root layout
- [x] Pixel ID configured in .env
- [x] Automatic PageView tracking enabled
- [x] Custom hook `useFacebookPixel` created
- [x] All standard events ready to use

### 🚧 To Implement (Optional)

Add tracking to specific pages:

#### Product Detail Page
```tsx
// app/product/[id]/page.tsx
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

const fb = useFacebookPixel();

useEffect(() => {
  fb.trackProductView({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category
  });
}, [product]);
```

#### Product Card (Add to Cart)
```tsx
// components/ProductCard.tsx
const fb = useFacebookPixel();

const handleAddToCart = async () => {
  await cartApi.addToCart({ productId: product.id, quantity: 1 });

  fb.trackCartAdd({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });
};
```

#### Checkout Page
```tsx
// app/checkout/page.tsx
const fb = useFacebookPixel();

useEffect(() => {
  fb.trackCheckoutStart({
    total: cart.total,
    itemCount: cart.items.length,
    productIds: cart.items.map(item => item.productId)
  });
}, []);
```

#### Order Confirmation
```tsx
// app/order-confirmation/page.tsx
const fb = useFacebookPixel();

useEffect(() => {
  if (order) {
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
```

---

## 🐛 Troubleshooting

### Pixel Not Loading

1. **Check Environment Variable**
   ```bash
   # In frontend directory
   cat .env | grep FB_PIXEL
   # Should show: NEXT_PUBLIC_FB_PIXEL_ID=3599167170310984
   ```

2. **Restart Development Server**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Look for `window.fbq` object

### Events Not Firing

1. **Check Facebook Pixel Helper**
   - Install the Chrome extension
   - Look for green checkmark (working) or red X (error)

2. **Check Browser Console**
   ```javascript
   // In browser console, type:
   window.fbq
   // Should show: function fbq() { ... }
   ```

3. **Enable Debug Mode**
   ```javascript
   // In browser console, type:
   window.fbq && window.fbq('set', 'debug', true);
   ```

### Wrong Currency

Make sure all tracking calls include:
```tsx
currency: 'PYG'  // ← Must be PYG for Guaraníes
```

---

## 📖 Documentation

Complete documentation available in:
- `frontend/FACEBOOK_PIXEL_SETUP.md` - Full integration guide
- `frontend/lib/facebook-pixel.ts` - Core library
- `frontend/hooks/useFacebookPixel.ts` - Custom hook
- `frontend/components/FacebookPixel.tsx` - React component

---

## 🎯 Quick Commands

```bash
# Start frontend only
cd frontend && npm run dev

# Start all services (Docker)
npm run dev:start

# View logs
npm run dev:logs

# Stop services
npm run dev:stop

# Check if services are running
npm run dev:ps
```

---

## ✨ What's Tracking Automatically

Right now, with zero additional code:
- ✅ **PageView** on every page navigation
- ✅ Pixel initialization on app load
- ✅ Route change tracking

---

## 🎉 You're All Set!

Your Facebook Pixel is live and tracking page views. To add more events (Add to Cart, Purchase, etc.), follow the examples in the "To Implement" section above.

**Test it now:**
1. Start the frontend: `cd frontend && npm run dev`
2. Open: http://localhost:3060
3. Check Facebook Pixel Helper extension
4. See PageView event! ✅

---

**Need Help?** Check the full documentation in `frontend/FACEBOOK_PIXEL_SETUP.md`

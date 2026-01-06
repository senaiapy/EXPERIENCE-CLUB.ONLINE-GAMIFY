# Mobile App Image Server Integration

Complete guide for image server integration in the Experience Club React Native/Expo mobile app.

## 📱 Overview

The mobile app now connects to the centralized image server running on the backend, just like the frontend and admin applications.

---

## ✅ What Was Implemented

### 1. **Environment Configuration**
   - ✅ Added `IMAGE_BASE_URL` to env.js schema
   - ✅ Updated `.env.development` with image URL
   - ✅ Updated `.env.production` with image URL

### 2. **Image Utilities**
   - ✅ Created `src/lib/image-utils.ts`
   - ✅ React Native/Expo compatible functions
   - ✅ Handles multiple image formats from API

### 3. **Component Updates**
   - ✅ Updated `ProductCard` to use utilities
   - ✅ Removed hardcoded URL construction
   - ✅ Centralized image handling

---

## 📂 Files Modified/Created

### Created Files
- `mobile/src/lib/image-utils.ts` - **NEW** Image utility functions

### Modified Files
- `mobile/env.js` - Added IMAGE_BASE_URL schema
- `mobile/.env.development` - Added IMAGE_BASE_URL variable
- `mobile/.env.production` - Added IMAGE_BASE_URL variable
- `mobile/src/components/ui/product-card.tsx` - Uses image utilities

---

## 🔧 Environment Variables

### Development (.env.development)
```bash
# Backend API URL
API_URL=https://api.experience-club.online/api

# Frontend URL (for static assets)
FRONTEND_URL=https://experience-club.online

# Image Base URL (served from backend)
IMAGE_BASE_URL=https://api.experience-club.online/images
```

### Production (.env.production)
```bash
# Backend API URL
API_URL=https://api.experience-club.online/api

# Frontend URL
FRONTEND_URL=https://experience-club.online

# Image Base URL (served from backend)
IMAGE_BASE_URL=https://api.experience-club.online/images
```

### Local Development Alternative
```bash
# For testing with local backend
API_URL=http://192.168.0.7:3062/api
FRONTEND_URL=http://192.168.0.7:3060
IMAGE_BASE_URL=http://192.168.0.7:3062/images
```

---

## 📚 Usage Examples

### Basic Product Image Display

**Before:**
```typescript
// ❌ Old hardcoded approach
const imageUrl = product.images?.[0]?.url
  ? `${Env.FRONTEND_URL}/images/${product.images[0].url}`
  : 'https://via.placeholder.com/300x300/e5e5e5/999999?text=No+Image';
```

**After:**
```typescript
// ✅ New centralized approach
import { getProductImageUrl } from '@/lib/image-utils';

const imageUrl = getProductImageUrl(product);
```

### Display Image in Component

```typescript
import { Image } from 'expo-image';
import { getProductImageUrl } from '@/lib/image-utils';

const MyComponent = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  return (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: 200, height: 200 }}
      contentFit="cover"
    />
  );
};
```

### Get All Product Images

```typescript
import { getProductImageUrls } from '@/lib/image-utils';

const ProductGallery = ({ product }) => {
  const imageUrls = getProductImageUrls(product);

  return (
    <ScrollView horizontal>
      {imageUrls.map((url, index) => (
        <Image
          key={index}
          source={{ uri: url }}
          style={{ width: 100, height: 100, marginRight: 10 }}
        />
      ))}
    </ScrollView>
  );
};
```

---

## 🛠️ Available Utility Functions

### Core Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getImageUrl(filename)` | `string \| null \| undefined` | `string` | Constructs full image URL from filename |
| `getProductImageUrl(product)` | `Product` | `string` | Gets product's main image URL |
| `getProductImageUrls(product)` | `Product` | `string[]` | Gets all product images |
| `getPlaceholderUrl()` | none | `string` | Returns placeholder image URL |
| `isValidImageUrl(url)` | `string \| null \| undefined` | `boolean` | Validates image URL |

### Additional Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getOptimizedImageUrl(filename, size)` | `string, 'small'\|'medium'\|'large'` | `string` | Gets optimized image (future use) |
| `getBrandImageUrl(brand)` | `Brand` | `string` | Gets brand logo URL |
| `getCategoryImageUrl(category)` | `Category` | `string` | Gets category image URL |
| `getImageCacheKey(url)` | `string` | `string` | Gets cache key for URL |

---

## 🔄 How It Works

### Image URL Construction Flow

```
1. Product from API
   ↓
2. product.images[0].url = "/images/product-123.jpg"
   ↓
3. getProductImageUrl(product)
   ↓
4. Constructs: IMAGE_BASE_URL + "/" + filename
   ↓
5. Result: "https://api.experience-club.online/images/product-123.jpg"
   ↓
6. Display in <Image> component
```

### Supported Image Formats

The utility functions handle multiple formats:

1. **New Schema (Array of Objects)**
   ```typescript
   {
     images: [
       { url: "/images/product-1.jpg", filename: "product-1.jpg" },
       { url: "/images/product-2.jpg", filename: "product-2.jpg" }
     ]
   }
   ```

2. **Legacy Schema (String)**
   ```typescript
   {
     images: "product-1.jpg"
   }
   ```

3. **Full URLs**
   ```typescript
   {
     images: [
       { url: "https://api.experience-club.online/images/product-1.jpg" }
     ]
   }
   ```

---

## 🧪 Testing

### Manual Testing

1. **Start the mobile app:**
   ```bash
   cd mobile
   npm start
   # or
   pnpm start
   ```

2. **Check image loading:**
   - Navigate to products list
   - Verify images load correctly
   - Check placeholder appears for missing images

3. **Test different scenarios:**
   - Products with images
   - Products without images
   - Products with multiple images
   - Slow network conditions

### Environment Variable Testing

```bash
# Test with development environment
APP_ENV=development npm start

# Test with production environment
APP_ENV=production npm start
```

### Debug Image URLs

Add temporary logging to see URLs:
```typescript
import { getProductImageUrl } from '@/lib/image-utils';

const imageUrl = getProductImageUrl(product);
console.log('Image URL:', imageUrl);
// Should print: https://api.experience-club.online/images/product-123.jpg
```

---

## 🐛 Troubleshooting

### Issue: Images not loading

**Symptoms:** Placeholder images or broken images

**Solutions:**
1. Check `IMAGE_BASE_URL` in environment:
   ```typescript
   import { Env } from '@env';
   console.log('IMAGE_BASE_URL:', Env.IMAGE_BASE_URL);
   ```

2. Verify backend is serving images:
   ```bash
   curl https://api.experience-club.online/images/product-1.jpg
   ```

3. Check product data structure:
   ```typescript
   console.log('Product images:', JSON.stringify(product.images, null, 2));
   ```

4. Clear app cache:
   ```bash
   # For Expo
   npx expo start -c
   ```

### Issue: Environment variable not found

**Symptoms:** Error: `IMAGE_BASE_URL is not defined`

**Solutions:**
1. Restart Metro bundler with cache clear:
   ```bash
   npm start -- --reset-cache
   ```

2. Verify `.env.development` file exists and has correct variable

3. Check `env.js` includes `IMAGE_BASE_URL` in schema

### Issue: Old URLs still being used

**Symptoms:** Images loading from frontend URL instead of backend

**Solutions:**
1. Check imports in component:
   ```typescript
   // ✅ Correct
   import { getProductImageUrl } from '@/lib/image-utils';

   // ❌ Wrong - using Env.FRONTEND_URL directly
   ```

2. Rebuild the app:
   ```bash
   npx expo start -c
   ```

---

## 📱 Platform-Specific Notes

### iOS
- Works with localhost on simulator
- Physical device requires network-accessible URL
- Requires `NSAppTransportSecurity` exception for HTTP

### Android
- Emulator uses `10.0.2.2` for localhost
- Physical device requires network-accessible URL or ADB reverse:
  ```bash
  adb reverse tcp:3062 tcp:3062
  ```

### Expo Go
- Cannot use localhost URLs
- Must use production URLs or ngrok/tunnel service

---

## 🚀 Future Enhancements

### Planned Features

1. **Image Caching**
   - Local cache for offline viewing
   - Progressive image loading
   - Cache invalidation strategy

2. **Image Optimization**
   - Request different sizes based on screen
   - WebP format for Android
   - Lazy loading for lists

3. **Error Handling**
   - Retry failed image loads
   - Show loading shimmer
   - Better error states

4. **Performance**
   - Image preloading
   - Memory management
   - Batch requests

---

## 📖 Component Integration Example

### Complete ProductCard Example

```typescript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { getProductImageUrl } from '@/lib/image-utils';
import { Text, View } from './ui';

export const ProductCard = ({ product, onPress }) => {
  // Get image URL using utility function
  const imageUrl = getProductImageUrl(product);

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        {/* Image */}
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 200, height: 200 }}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />

        {/* Product Info */}
        <Text>{product.name}</Text>
        <Text>Gs. {product.price?.toLocaleString('es-PY')}</Text>
      </View>
    </TouchableOpacity>
  );
};
```

---

## ✅ Checklist

### Integration Complete When:
- [x] `IMAGE_BASE_URL` added to env.js
- [x] Environment files updated
- [x] `image-utils.ts` created
- [x] ProductCard uses utilities
- [x] App runs without errors
- [x] Images load correctly
- [x] Placeholder shows for missing images

### Verification Steps:
1. Start mobile app: `npm start`
2. Navigate to products list
3. Verify images display correctly
4. Check console for any errors
5. Test with and without network

---

## 📞 Support

For issues or questions:
- Main Documentation: [IMAGE_SERVER_DOCUMENTATION.md](./IMAGE_SERVER_DOCUMENTATION.md)
- Quick Reference: [IMAGE_SERVER_QUICK_REFERENCE.md](./IMAGE_SERVER_QUICK_REFERENCE.md)
- Backend API: http://localhost:3062/api/docs

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Platform:** React Native / Expo

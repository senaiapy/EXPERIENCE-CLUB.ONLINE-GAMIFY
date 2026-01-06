# Image Server Implementation - Experience Club

Complete documentation for the centralized image server implementation.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup & Configuration](#setup--configuration)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Integration](#frontend-integration)
6. [Admin Integration](#admin-integration)
7. [Mobile Integration](#mobile-integration)
8. [API Endpoints](#api-endpoints)
9. [Testing](#testing)
10. [Migration Guide](#migration-guide)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The image server provides centralized image storage and serving for all Experience Club applications (Frontend, Admin, Mobile) through the NestJS backend.

### Key Features

✅ **Centralized Storage**: All images stored in `/backend/public/images`
✅ **Unified API**: Single source of truth for image URLs
✅ **CRUD Operations**: Complete image management from admin panel
✅ **Automatic Seeding**: Database seed script uses correct image URLs
✅ **Environment-Based**: Configurable for development and production
✅ **Type-Safe**: TypeScript utilities for image handling

---

## Architecture

### Storage Structure

```
/backend/
  └── public/
      └── images/              # Main product images directory
          ├── product-1.jpg
          ├── product-2.png
          └── ...
  └── uploads/                 # Alternative upload directory (legacy)
```

### Image URL Pattern

**Development:**
```
http://localhost:3062/images/product-123.jpg
```

**Production:**
```
https://api.experience-club.online/images/product-123.jpg
```

### Data Flow

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Admin     │─────▶│   Backend   │─────▶│  Database    │
│  (Upload)   │      │   (API)     │      │ (ProductImage)│
└─────────────┘      └─────────────┘      └──────────────┘
                           │
                           │ Serves images
                           ▼
       ┌──────────────────────────────────────┐
       │                                      │
  ┌────▼─────┐    ┌────────────┐    ┌───────▼────┐
  │ Frontend │    │   Admin    │    │   Mobile   │
  └──────────┘    └────────────┘    └────────────┘
```

---

## Setup & Configuration

### 1. Environment Variables

**Root `.env` (Updated):**
```bash
NEXT_PUBLIC_IMAGE_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}/images
```

**Frontend `.env` (Already configured):**
```bash
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.experience-club.online/images
```

**Admin `.env` (Already configured):**
```bash
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.experience-club.online/images
```

### 2. Backend Static File Serving

**File:** `backend/src/app.module.ts`

```typescript
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '..', 'uploads'),
  serveRoot: '/uploads',
}),
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '..', 'public', 'images'),
  serveRoot: '/images',
}),
```

### 3. Database Seeding

**File:** `backend/prisma/seed.ts`

```typescript
// Creates ProductImage with correct URL format
await prisma.productImage.create({
  data: {
    productId: product.id,
    filename: imageFilename,
    size: 'MEDIUM',
    url: `/images/${imageFilename}`,  // ✅ Correct format
  },
});
```

---

## Backend Implementation

### Static File Configuration

**Location:** `backend/src/app.module.ts`

Serves images from `/backend/public/images` at the `/images` endpoint.

### Image Upload Endpoint

**Location:** `backend/src/products/products.controller.ts`

**Endpoint:** `POST /api/products/:id/public-image`

**Authentication:** JWT + Admin Guard required

**Features:**
- File validation (JPG, PNG, GIF, WebP)
- Max file size: 10MB
- Automatic filename: `product-{id}.{ext}`
- Overwrites existing image
- Updates ProductImage record

**Implementation:**
```typescript
@Post(':id/public-image')
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        const productId = req.params.id;
        const ext = extname(file.originalname);
        cb(null, `product-${productId}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
)
uploadPublicImage(@Param('id') productId: string, @UploadedFile() file: Express.Multer.File) {
  return this.productsService.addPublicImage(productId, file);
}
```

### Service Method

**Location:** `backend/src/products/products.service.ts`

```typescript
async addPublicImage(productId: string, file: Express.Multer.File) {
  const product = await this.findOne(productId);

  const existingImage = await this.prisma.productImage.findFirst({
    where: { productId, size: 'MEDIUM' },
  });

  const imageUrl = `/images/${file.filename}`;

  if (existingImage) {
    // Remove old file and update record
    const oldImagePath = path.join(process.cwd(), 'public', 'images', existingImage.filename);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    return this.prisma.productImage.update({
      where: { id: existingImage.id },
      data: { filename: file.filename, url: imageUrl },
    });
  } else {
    // Create new image record
    return this.prisma.productImage.create({
      data: {
        filename: file.filename,
        size: 'MEDIUM',
        url: imageUrl,
        productId,
      },
    });
  }
}
```

---

## Frontend Integration

### Image Utility Functions

**Location:** `frontend/lib/image-utils.ts`

**Key Functions:**

```typescript
// Get full image URL from filename
getImageUrl(filename: string): string

// Get product image URL (handles arrays and strings)
getProductImageUrl(product: any): string

// Get all product images
getProductImageUrls(product: any): string[]

// Get placeholder
getPlaceholderUrl(): string

// Validate image URL
isValidImageUrl(url: string): boolean
```

**Usage Example:**
```typescript
import { getProductImageUrl } from '@/lib/image-utils';

const ProductCard = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  return <img src={imageUrl} alt={product.name} />;
};
```

### ProductCard Update

**Location:** `frontend/components/ProductCard.tsx`

**Before:**
```typescript
const imageSrc = `/images/${product.images}`;  // ❌ Incomplete URL
```

**After:**
```typescript
import { getProductImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

const [imageSrc, setImageSrc] = useState(getProductImageUrl(product));  // ✅ Full URL

const handleImageError = () => {
  if (!imageError) {
    setImageError(true);
    setImageSrc(getPlaceholderUrl());
  }
};
```

---

## Admin Integration

### Image Utility Functions

**Location:** `admin/lib/image-utils.ts`

**Additional Admin Functions:**

```typescript
// Upload product image
uploadProductImage(productId: string, file: File): Promise<{success: boolean, data?, error?}>

// Delete product image
deleteProductImage(imageId: string): Promise<{success: boolean, error?}>

// Validate file before upload
validateImageFile(file: File): {valid: boolean, error?}
```

### ImageUpload Component

**Location:** `admin/components/ImageUpload.tsx`

**Features:**
- Live image preview
- Drag & drop support
- File validation
- Upload progress
- Error handling
- Success callbacks

**Props:**
```typescript
interface ImageUploadProps {
  productId?: string;          // Required for upload
  currentImage?: string;        // Show existing image
  onUploadSuccess?: (data) => void;
  onUploadError?: (error) => void;
  disabled?: boolean;
}
```

**Usage:**
```typescript
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  productId={product.id}
  currentImage={product.images}
  onUploadSuccess={(data) => {
    console.log('Uploaded:', data);
    refreshProduct();
  }}
  onUploadError={(error) => {
    alert(`Error: ${error}`);
  }}
/>
```

### Product Add Form

**Location:** `admin/app/admin/products/add/page.tsx`

**Workflow:**

1. **Create Product** → Save to database, get product ID
2. **Upload Image** → ImageUpload component appears
3. **Submit Image** → Uploads to `/backend/public/images`
4. **Success** → Redirects to products list

**Implementation:**
```typescript
const [createdProductId, setCreatedProductId] = useState<string | null>(null);

const handleSubmit = async (e) => {
  // ... create product
  const createdProduct = await productsApi.createProduct(newProduct);
  setCreatedProductId(createdProduct.id);  // Enable image upload
  alert('Producto creado! Ahora puedes subir una imagen.');
};

return (
  <form onSubmit={handleSubmit}>
    {/* ... form fields ... */}

    {createdProductId && (
      <ImageUpload
        productId={createdProductId}
        onUploadSuccess={() => router.push('/admin/products')}
      />
    )}
  </form>
);
```

---

## Mobile Integration

### Image Utility Functions

**Location:** `mobile/src/lib/image-utils.ts`

**Key Functions:**

```typescript
// Get full image URL from filename
getImageUrl(filename: string): string

// Get product image URL (handles arrays and strings)
getProductImageUrl(product: any): string

// Get all product images
getProductImageUrls(product: any): string[]

// Get placeholder
getPlaceholderUrl(): string

// Validate image URL
isValidImageUrl(url: string): boolean
```

**Usage Example:**
```typescript
import { Image } from 'expo-image';
import { getProductImageUrl } from '@/lib/image-utils';

const ProductCard = ({ product }) => {
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

### Environment Configuration

**Location:** `mobile/env.js`

```javascript
const client = z.object({
  // ... other vars
  IMAGE_BASE_URL: z.string(),
});

const _clientEnv = {
  // ... other vars
  IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
};
```

**Environment Files:**

**`.env.development`:**
```bash
IMAGE_BASE_URL=https://api.experience-club.online/images
```

**`.env.production`:**
```bash
IMAGE_BASE_URL=https://api.experience-club.online/images
```

### ProductCard Update

**Location:** `mobile/src/components/ui/product-card.tsx`

**Before:**
```typescript
const imageUrl = product.images?.[0]?.url
  ? `${Env.FRONTEND_URL}/images/${product.images[0].url}`
  : 'https://via.placeholder.com/300x300/e5e5e5/999999?text=No+Image';
```

**After:**
```typescript
import { getProductImageUrl } from '@/lib/image-utils';

const imageUrl = getProductImageUrl(product);  // ✅ Centralized
```

### Complete Mobile Documentation

See [MOBILE_IMAGE_INTEGRATION.md](./MOBILE_IMAGE_INTEGRATION.md) for:
- Complete setup guide
- Platform-specific notes (iOS/Android)
- Troubleshooting
- Testing procedures

---

## API Endpoints

### Product Image Upload

```http
POST /api/products/:id/public-image
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Body:
  file: [image file]
```

**Response:**
```json
{
  "id": "uuid",
  "productId": "product-id",
  "filename": "product-123.jpg",
  "size": "MEDIUM",
  "url": "/images/product-123.jpg",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Product Image Delete

```http
DELETE /api/products/images/:imageId
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

### Get Product Images (Legacy)

```http
POST /api/products/:id/images/:size
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Sizes: SMALL, MEDIUM, LARGE, HOME
```

---

## Testing

### Manual Testing Checklist

#### Backend
- [ ] Images accessible at `http://localhost:3062/images/product-1.jpg`
- [ ] Upload endpoint returns 401 without JWT
- [ ] Upload endpoint accepts valid image files
- [ ] Upload endpoint rejects non-image files
- [ ] Upload endpoint rejects files > 10MB
- [ ] Database records created with correct URL format

#### Frontend
- [ ] ProductCard displays images correctly
- [ ] Image fallback works on 404
- [ ] Image URLs constructed correctly
- [ ] getProductImageUrl handles arrays
- [ ] getProductImageUrl handles strings
- [ ] getProductImageUrl handles null/undefined

#### Admin
- [ ] ImageUpload component renders
- [ ] File selection works
- [ ] Image preview displays
- [ ] Upload button disabled without product ID
- [ ] Upload succeeds and shows success message
- [ ] Form redirects after successful upload
- [ ] Validation rejects invalid files

### Automated Testing Commands

```bash
# Backend tests
npm run test -w backend

# Frontend tests
npm run test -w frontend

# Admin tests
npm run test -w admin

# E2E tests
npm run test:e2e
```

---

## Migration Guide

### For Existing Products

Run this SQL to update existing ProductImage records:

```sql
-- Update ProductImage URLs to use /images path
UPDATE "ProductImage"
SET url = '/images/' || filename
WHERE url NOT LIKE '/images/%';

-- Verify update
SELECT id, filename, url FROM "ProductImage" LIMIT 10;
```

### Re-seed Database

```bash
# Reset database and re-seed with corrected URLs
npm run docker:migrate:reset
npm run docker:seed
```

### File Migration Script

If images are in wrong location:

```bash
# Move images from uploads to public/images
mkdir -p backend/public/images
cp backend/uploads/*.{jpg,png,gif,webp} backend/public/images/
```

---

## Troubleshooting

### Issue: Images not loading in frontend

**Symptoms:** Broken image icons, 404 errors in console

**Solutions:**
1. Check `NEXT_PUBLIC_IMAGE_BASE_URL` is set correctly
2. Verify backend is serving `/images` endpoint:
   ```bash
   curl http://localhost:3062/images/product-1.jpg
   ```
3. Check image file exists in `/backend/public/images`
4. Verify ProductImage records have correct URL format:
   ```sql
   SELECT * FROM "ProductImage" WHERE productId = 'xxx';
   ```

### Issue: Upload fails in admin

**Symptoms:** "Authentication required" or "Upload failed" error

**Solutions:**
1. Check JWT token exists in localStorage:
   ```javascript
   console.log(localStorage.getItem('token'));
   ```
2. Verify token is valid (not expired)
3. Check user has admin role
4. Check backend logs for detailed error:
   ```bash
   npm run dev:logs
   ```

### Issue: Wrong image displayed

**Symptoms:** Product shows different product's image

**Solutions:**
1. Check product ID is correct
2. Verify ProductImage relation:
   ```sql
   SELECT * FROM "ProductImage" WHERE productId = 'correct-id';
   ```
3. Clear browser cache
4. Re-upload image with correct product ID

### Issue: Seed script fails

**Symptoms:** Error during `npm run docker:seed`

**Solutions:**
1. Verify image files exist in `/backend/public/images`
2. Check products.json has valid image filenames
3. Ensure database is empty before seeding:
   ```bash
   npm run docker:migrate:reset
   ```

---

## Best Practices

### ✅ DO

- Use `getProductImageUrl()` utility function
- Handle image load errors with fallback
- Validate files before upload
- Show upload progress to users
- Store relative URLs in database (`/images/x.jpg`)
- Use environment variables for base URLs

### ❌ DON'T

- Hardcode image URLs in components
- Skip file validation
- Store full URLs in database
- Allow unauthenticated uploads
- Upload without product ID
- Forget to handle loading states

---

## Future Enhancements

### Planned Features

1. **Image Optimization**
   - Automatic WebP conversion
   - Multiple size variants (thumbnail, medium, large)
   - Lazy loading integration

2. **CDN Integration**
   - Cloudinary/CloudFront integration
   - Automatic cache invalidation
   - Global image delivery

3. **Advanced Upload**
   - Drag & drop multiple files
   - Bulk upload for multiple products
   - Image cropping/editing in browser

4. **Mobile App Integration**
   - React Native image picker
   - Offline image caching
   - Progressive image loading

---

## Summary

### What Changed

1. ✅ Backend now serves `/backend/public/images` at `/images` endpoint
2. ✅ New upload endpoint: `POST /api/products/:id/public-image`
3. ✅ Environment variable updated: `NEXT_PUBLIC_IMAGE_BASE_URL`
4. ✅ Seed script uses correct URL format: `/images/filename.jpg`
5. ✅ Image utility functions created for frontend & admin
6. ✅ ImageUpload component added to admin
7. ✅ Product form integrates image upload workflow
8. ✅ Frontend ProductCard uses centralized image URLs

### Key Files Modified

- `backend/src/app.module.ts` - Static file serving
- `backend/src/products/products.controller.ts` - Upload endpoint
- `backend/src/products/products.service.ts` - Service method
- `backend/prisma/seed.ts` - Seed script URL format
- `.env` - Environment variables
- `frontend/lib/image-utils.ts` - **NEW** Utility functions
- `frontend/components/ProductCard.tsx` - Uses utilities
- `admin/lib/image-utils.ts` - **NEW** Utility functions
- `admin/components/ImageUpload.tsx` - **NEW** Upload component
- `admin/app/admin/products/add/page.tsx` - Integrated upload

---

## Contact & Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/club-de-ofertas/issues)
- Documentation: `CLAUDE.md`
- Email: dev@experience-club.online

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Author:** Claude AI (Anthropic)

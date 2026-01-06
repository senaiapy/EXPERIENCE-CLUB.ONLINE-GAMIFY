# Image Server - Quick Reference Guide

## 🚀 Quick Start

### Backend Setup (Already Configured)
```bash
# Images are served from:
backend/public/images/

# Accessible at:
http://localhost:3062/images/{filename}
```

### Environment Variables
```bash
# Root .env
NEXT_PUBLIC_IMAGE_BASE_URL=http://${SERVER_IP}:${BACKEND_PORT}/images

# Production (frontend/.env, admin/.env)
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.experience-club.online/images
```

---

## 📦 Usage Examples

### Frontend - Display Product Image
```typescript
import { getProductImageUrl } from '@/lib/image-utils';

const ProductCard = ({ product }) => {
  const imageUrl = getProductImageUrl(product);
  return <img src={imageUrl} alt={product.name} />;
};
```

### Admin - Upload Product Image
```typescript
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  productId={product.id}
  onUploadSuccess={(data) => {
    console.log('Uploaded:', data);
    router.push('/admin/products');
  }}
/>
```

### Admin - Manual Upload with API
```typescript
import { uploadProductImage } from '@/lib/image-utils';

const handleUpload = async (file: File) => {
  const result = await uploadProductImage(productId, file);
  if (result.success) {
    console.log('Success:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

---

## 🔧 API Endpoints

### Upload Image
```bash
POST /api/products/:id/public-image
Authorization: Bearer {token}
Content-Type: multipart/form-data
Body: file={image}

# Response
{
  "id": "uuid",
  "filename": "product-123.jpg",
  "url": "/images/product-123.jpg"
}
```

### Delete Image
```bash
DELETE /api/products/images/:imageId
Authorization: Bearer {token}

# Response
{ "message": "Image deleted successfully" }
```

---

## 🛠️ Utility Functions

### Frontend/Admin (`lib/image-utils.ts`)

| Function | Description | Returns |
|----------|-------------|---------|
| `getImageUrl(filename)` | Constructs full image URL | `string` |
| `getProductImageUrl(product)` | Gets product's main image URL | `string` |
| `getProductImageUrls(product)` | Gets all product images | `string[]` |
| `getPlaceholderUrl()` | Returns placeholder image | `string` |
| `isValidImageUrl(url)` | Validates image URL | `boolean` |

### Admin Only

| Function | Description | Returns |
|----------|-------------|---------|
| `uploadProductImage(id, file)` | Uploads image | `Promise<{success, data?, error?}>` |
| `deleteProductImage(imageId)` | Deletes image | `Promise<{success, error?}>` |
| `validateImageFile(file)` | Validates file | `{valid, error?}` |

---

## 📁 File Locations

### Created Files
```
✅ backend/src/app.module.ts (modified)
✅ backend/src/products/products.controller.ts (modified)
✅ backend/src/products/products.service.ts (modified)
✅ backend/prisma/seed.ts (modified)
✅ frontend/lib/image-utils.ts (new)
✅ frontend/components/ProductCard.tsx (modified)
✅ admin/lib/image-utils.ts (new)
✅ admin/components/ImageUpload.tsx (new)
✅ admin/app/admin/products/add/page.tsx (modified)
✅ .env (modified)
```

---

## 🧪 Testing Commands

```bash
# Check backend serving images
curl http://localhost:3062/images/product-1.jpg

# Seed database with corrected URLs
npm run docker:seed

# Run backend tests
npm run test -w backend

# View logs
npm run dev:logs
```

---

## ⚡ Common Operations

### Add New Product with Image (Admin)
1. Fill product form
2. Click "Guardar Producto"
3. Wait for product creation
4. ImageUpload component appears
5. Select image file
6. Click "Upload Image"
7. Success → Redirects to products list

### Display Product in Frontend
```typescript
// ProductCard.tsx automatically uses getProductImageUrl()
<img src={getProductImageUrl(product)} alt={product.name} />
```

### Seed Database
```bash
# Images will automatically use /images/ prefix
npm run docker:seed

# Verify in database
psql -h localhost -p 15432 -U clubdeofertas -d clubdeofertas
SELECT id, filename, url FROM "ProductImage" LIMIT 5;
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check `NEXT_PUBLIC_IMAGE_BASE_URL` in .env |
| Upload fails | Verify JWT token exists in localStorage |
| 404 errors | Ensure image exists in `backend/public/images/` |
| Wrong image shown | Check ProductImage.productId in database |
| Seed fails | Run `npm run docker:migrate:reset` first |

---

## 📊 Database Schema

```sql
-- ProductImage table
CREATE TABLE "ProductImage" (
  id UUID PRIMARY KEY,
  productId UUID NOT NULL,
  filename TEXT NOT NULL,
  size VARCHAR(10) NOT NULL,  -- SMALL, MEDIUM, LARGE, HOME
  url TEXT NOT NULL,           -- /images/filename.jpg
  createdAt TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES "Product"(id)
);
```

---

## 🔒 Security Notes

- Upload requires JWT authentication
- Admin role required for upload
- File type validation (JPG, PNG, GIF, WebP only)
- Max file size: 10MB
- Filename sanitization applied

---

## 📚 Full Documentation

For complete details, see: [IMAGE_SERVER_DOCUMENTATION.md](./IMAGE_SERVER_DOCUMENTATION.md)

---

**Version:** 1.0.0 | **Last Updated:** January 2025

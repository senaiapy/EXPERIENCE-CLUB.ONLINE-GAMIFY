# Image Handling Implementation Analysis
## Club de Ofertas E-Commerce Platform

**Analysis Date:** November 5, 2025  
**Repository:** /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY

---

## Executive Summary

The Club de Ofertas platform implements a **dual image system**:

1. **Legacy System (ProductImage)**: One-to-many relationship with products (one image per size: SMALL, MEDIUM, LARGE, HOME)
2. **New Unified System (Image)**: Centralized image management with relationships to Products, Brands, and Categories

**Current State:**
- Backend serves images from `/uploads` directory via NestJS ServeStaticModule
- Multer handles file uploads with validation (10MB limit, image types only)
- Sharp processes/optimizes images during upload
- Frontend displays images from API URLs
- Admin panel manages products with image associations

---

## 1. BACKEND IMAGE HANDLING

### 1.1 Prisma Schema

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/prisma/schema.prisma`

#### Legacy ProductImage Model (Lines 82-92)
```prisma
model ProductImage {
  id        String    @id @default(cuid())
  filename  String
  size      ImageSize
  url       String
  productId String
  createdAt DateTime  @default(now())
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, size])
}
```

**Purpose:** Direct image storage, one per size per product  
**Constraints:** Unique on (productId, size) - only one image per size

#### New Unified Image Model (Lines 165-196)
```prisma
model Image {
  id                String                  @id @default(cuid())
  name              String
  description       String?
  originalName      String
  filename          String                  @unique
  path              String
  url               String
  mimeType          String
  size              Int
  type              ImageType
  imageSize         ImageSize?
  width             Int?
  height            Int?
  alt               String?
  isActive          Boolean                 @default(true)
  sortOrder         Int?                    @default(0)
  tags              String[]
  metadata          Json?
  uploadedById      String?
  createdAt         DateTime                @default(now())
  updatedAt         DateTime                @updatedAt
  brandRelations    BrandImageRelation[]
  categoryRelations CategoryImageRelation[]
  uploadedBy        User?                   @relation(fields: [uploadedById], references: [id])
  productRelations  ProductImageRelation[]

  @@index([type])
  @@index([imageSize])
  @@index([isActive])
  @@index([createdAt])
}
```

**Metadata Stored:**
- `type`: ImageType enum (PRODUCT, BANNER, BRAND, CATEGORY, OTHER)
- `imageSize`: ImageSize enum (SMALL, MEDIUM, LARGE, HOME)
- `width`, `height`: Actual image dimensions
- `mimeType`: Content type (image/jpeg, image/png, etc.)
- `size`: File size in bytes
- `tags`: Array of searchable tags
- `metadata`: JSON for custom attributes
- `uploadedById`: User who uploaded image

#### Image Relationships
```prisma
model ProductImageRelation {
  id        String   @id @default(cuid())
  productId String
  imageId   String
  isPrimary Boolean  @default(false)
  sortOrder Int?     @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  image     Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, imageId])
}

model BrandImageRelation {
  id        String   @id @default(cuid())
  brandId   String
  imageId   String
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  image     Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)

  @@unique([brandId, imageId])
}

model CategoryImageRelation {
  id         String   @id @default(cuid())
  categoryId String
  imageId    String
  isPrimary  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  image      Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)

  @@unique([categoryId, imageId])
}
```

### 1.2 Static File Serving Configuration

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    // ... other modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Behavior:**
- Serves static files from `/uploads` directory
- Files accessible at: `http://localhost:3062/uploads/filename.ext`
- Resolves to: `{project-root}/backend/uploads/`

### 1.3 Images Controller

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/images/images.controller.ts`

#### Upload Endpoint (Lines 28-66)
```typescript
@UseGuards(JwtAuthGuard)
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Only image files are allowed!'), false);
    }
  }
}))
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body('name') name?: string,
  @Body('description') description?: string,
  @Body('type') type?: ImageType,
  @Body('imageSize') imageSize?: ImageSize,
  @Body('alt') alt?: string,
  @Body('tags') tags?: string,
  @Body('metadata') metadata?: string,
  @Req() req?: any
) {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  const imageData: Partial<CreateImageDto> = {
    name: name || file.originalname,
    description,
    type: type || ImageType.OTHER,
    imageSize,
    alt,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    metadata: metadata ? JSON.parse(metadata) : undefined
  };

  return this.imagesService.uploadFile(file, imageData, req.user?.id);
}
```

**Supported Operations:**
- `POST /api/images/upload` - Upload new image (JWT required)
- `GET /api/images` - List images (paginated, searchable)
- `GET /api/images/:id` - Get specific image
- `PATCH /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image

**Relation Management:**
- `POST /api/images/:id/attach/product/:productId` - Attach to product
- `DELETE /api/images/:id/detach/product/:productId` - Detach from product
- `GET /api/images/product/:productId` - Get product images
- Similar for brands and categories

### 1.4 Images Service

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/images/images.service.ts`

#### Upload File Implementation (Lines 169-236)
```typescript
async uploadFile(file: Express.Multer.File, imageData: Partial<CreateImageDto>, userId?: string) {
  const uploadDir = path.join(process.cwd(), 'uploads');
  
  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const fileExtension = path.extname(file.originalname);
  const filename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(uploadDir, filename);
  const url = `/uploads/${filename}`;

  // Process and save the image
  let processedBuffer = file.buffer;
  let width: number | undefined;
  let height: number | undefined;

  try {
    const sharpImage = sharp(file.buffer);
    const metadata = await sharpImage.metadata();
    width = metadata.width;
    height = metadata.height;

    // Optimize image based on type
    if (imageData.imageSize) {
      switch (imageData.imageSize) {
        case ImageSize.HOME:
          processedBuffer = await sharpImage
            .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
          break;
        case ImageSize.SMALL:
          processedBuffer = await sharpImage
            .resize(150, 150, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          break;
        case ImageSize.MEDIUM:
          processedBuffer = await sharpImage
            .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
          break;
        case ImageSize.LARGE:
          processedBuffer = await sharpImage
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 90 })
            .toBuffer();
          break;
      }
    }
  } catch (error) {
    console.warn('Image processing failed, using original:', error);
  }

  await fs.writeFile(filePath, processedBuffer);

  // Create image record
  const createImageDto: CreateImageDto = {
    name: imageData.name || file.originalname,
    description: imageData.description,
    originalName: file.originalname,
    filename,
    path: filePath,
    url,
    mimeType: file.mimetype,
    size: processedBuffer.length,
    type: imageData.type || ImageType.OTHER,
    imageSize: imageData.imageSize,
    width,
    height,
    alt: imageData.alt,
    isActive: imageData.isActive !== false,
    sortOrder: imageData.sortOrder || 0,
    tags: imageData.tags || [],
    metadata: imageData.metadata,
  };

  return this.create(createImageDto, userId);
}
```

**Image Optimization:**
- **HOME size**: 400x400px, 85% quality, WebP
- **SMALL size**: 150x150px, 80% quality, WebP
- **MEDIUM size**: 300x300px, 85% quality, WebP
- **LARGE size**: 800x800px, 90% quality, WebP

**Storage Details:**
- Files saved to: `{project-root}/backend/uploads/`
- Filename: UUID + original extension
- Database stores: filename, path, URL, dimensions, MIME type

### 1.5 Products Image Handling (Legacy)

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/products/products.controller.ts` (Lines 207-266)

```typescript
@ApiOperation({ summary: 'Upload product image' })
@ApiConsumes('multipart/form-data')
@ApiParam({ name: 'size', description: 'Image size', enum: ['SMALL', 'MEDIUM', 'LARGE', 'HOME'] })
@UseGuards(JwtAuthGuard, AdminGuard)
@Post(':id/images/:size')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }),
)
async uploadImage(
  @Param('id') productId: string,
  @Param('size') sizeParam: string,
  @UploadedFile() file: Express.Multer.File,
) {
  const size = sizeParam.toUpperCase() as ImageSize;

  if (!Object.values(ImageSize).includes(size)) {
    throw new BadRequestException('Invalid image size. Must be SMALL, MEDIUM, LARGE, or HOME');
  }

  return this.productsService.addImage(productId, file, size);
}
```

**Endpoint:** `POST /api/products/:id/images/:size`
**File Storage:** Uses multer diskStorage to `./uploads`
**Filename:** Randomized hex string + original extension

**Product Service Implementation (Lines 289-328):**
```typescript
async addImage(productId: string, file: Express.Multer.File, size: ImageSize) {
  const product = await this.findOne(productId);
  
  // Check if image with this size already exists
  const existingImage = await this.prisma.productImage.findUnique({
    where: {
      productId_size: {
        productId,
        size,
      },
    },
  });

  if (existingImage) {
    // Remove old image file
    const oldImagePath = path.join(process.cwd(), 'uploads', existingImage.filename);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
    
    // Update with new image
    return this.prisma.productImage.update({
      where: { id: existingImage.id },
      data: {
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      },
    });
  } else {
    // Create new image
    return this.prisma.productImage.create({
      data: {
        filename: file.filename,
        size,
        url: `/uploads/${file.filename}`,
        productId,
      },
    });
  }
}
```

### 1.6 CORS and Static File Serving

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for multiple origins
  app.enableCors({
    origin: [
      'http://localhost:3060',
      'http://localhost:3061',
      'https://experience-club.online',
      'https://admin.experience-club.online',
      // ... more origins
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // ... rest of setup
}
```

**Result:** Images served at: `/api/uploads/{filename}`

---

## 2. FRONTEND IMAGE HANDLING

### 2.1 Environment Variables

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/.env`

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.experience-club.online/api
API_URL=https://api.experience-club.online/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.experience-club.online/images
```

**Note:** `NEXT_PUBLIC_IMAGE_BASE_URL` currently set to `/images` but images are served from `/uploads`

### 2.2 Axios Configuration

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/lib/axios.ts`

```typescript
import axios from 'axios';

const getBaseURL = () => {
  // Server-side (during build and SSR)
  if (typeof window === 'undefined') {
    return process.env.API_URL || 'http://backend:3002/api';
  }
  // Client-side (browser)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3062/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles 401 redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.3 Products API Service

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/lib/products-api.ts` (Lines 32-38)

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  price_sale?: number | string;
  stock: number;
  images?: Array<{
    id: string;
    filename: string;
    size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'HOME';
    url: string;
  }>;
  // ... other fields
}
```

**Image URL Pattern from API:**
- URLs returned as: `/uploads/filename.ext`
- Frontend constructs: `http://localhost:3062/api/uploads/filename.ext`

### 2.4 Frontend Image Display

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/components/ProductCard.tsx` (Lines 20-33)

```typescript
'use client';

import { useState } from 'react';
import { ClubDeOfertasProduct } from '../types';

export default function ProductCard({ product }: { product: ClubDeOfertasProduct }) {
  const [imageSrc, setImageSrc] = useState(`/images/${product.images}`);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/placeholder-product.svg');
    }
  };

  return (
    <>
      <div className="relative aspect-square overflow-hidden">
        {!imageError ? (
          <img 
            src={imageSrc}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            Imagen no disponible
          </div>
        )}
      </div>
      {/* rest of component */}
    </>
  );
}
```

**Image Path Logic:**
- Assumes images in `/public/images/` directory
- Falls back to `/placeholder-product.svg`
- Uses local public images, NOT API images

### 2.5 Image Path Construction in Admin

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/app/admin/products/page.tsx` (Lines 307-318)

```typescript
// Get image URL - files in /public/images/ are served as /images/filename.jpg
let imageUrl = '/images/placeholder-product.png';
if (product.images && Array.isArray(product.images) && product.images.length > 0) {
  const imageFilename = product.images.find(img => img.size === 'HOME')?.url ||
                       product.images.find(img => img.size === 'SMALL')?.url ||
                       product.images[0]?.url;

  if (imageFilename) {
    // Images are in /public/images/, served as /images/filename.jpg
    imageUrl = `/images/${imageFilename}`;
  }
}
```

**Assumption:** Admin expects image URLs to already be filenames, constructs `/images/{filename}` paths

---

## 3. ADMIN DASHBOARD IMAGE HANDLING

### 3.1 Product Form (Add/Edit)

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/app/admin/products/add/page.tsx` (Lines 377-390)

```typescript
<div>
  <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    URL de Imagen
  </label>
  <input
    type="url"
    id="imagem"
    name="imagem"
    value={formData.imagem}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
    placeholder="https://example.com/image.jpg"
  />
</div>
```

**Current Implementation:**
- Takes image URL as string input
- Backend downloads image via axios in `downloadAndSaveProductImage()`
- Saves to: `/admin/public/images/` (via products service)

### 3.2 Product Creation with Image Download

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/src/products/products.service.ts` (Lines 80-133)

```typescript
private async downloadAndSaveProductImage(productId: string, imageUrl: string): Promise<void> {
  try {
    const axios = require('axios');

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // Get file extension from URL or content-type
    let ext = path.extname(imageUrl).split('?')[0];
    if (!ext || ext === '') {
      const contentType = response.headers['content-type'];
      if (contentType?.includes('jpeg') || contentType?.includes('jpg')) ext = '.jpg';
      else if (contentType?.includes('png')) ext = '.png';
      else if (contentType?.includes('webp')) ext = '.webp';
      else ext = '.jpg';
    }

    // Generate filename
    const filename = `product-${productId}${ext}`;

    // Ensure public/images directory exists
    const imagesDir = path.join(process.cwd(), '..', 'admin', 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Save file
    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, response.data);

    // Create ProductImage records for different sizes
    const imageSizes: ImageSize[] = ['SMALL', 'MEDIUM', 'LARGE', 'HOME'];

    for (const size of imageSizes) {
      await this.prisma.productImage.create({
        data: {
          filename,
          size,
          url: `/images/${filename}`,
          productId,
        },
      });
    }

    console.log(`Successfully downloaded and saved image for product ${productId}: ${filename}`);
  } catch (error) {
    console.error(`Failed to download image from ${imageUrl}:`, error.message);
    throw error;
  }
}
```

**Process:**
1. Backend receives imageUrl string from admin
2. Axios downloads image from external URL
3. Saves to: `../admin/public/images/product-{productId}.{ext}`
4. Creates ProductImage records with URL: `/images/product-{productId}.{ext}`
5. Front-end displays as: `/images/product-{productId}.{ext}`

### 3.3 Admin Products List with Images

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/app/admin/products/page.tsx` (Lines 322-333)

```typescript
<td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    <div className="flex-shrink-0 h-12 w-12">
      <img
        className="h-12 w-12 rounded-lg object-cover"
        src={imageUrl}
        alt={product.name}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/no-image.jpg';
        }}
      />
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
        {product.name}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        ID: {product.id}
      </div>
    </div>
  </div>
</td>
```

**Error Handling:**
- On image load error: fallback to `/images/no-image.jpg`
- Public images directory: `/admin/public/images/`

---

## 4. DATABASE ENTRIES FOR IMAGES

### 4.1 Legacy ProductImage Examples

```
ProductImage table:
┌──────────────────────────┬──────────────────────────────────┬───────────┬──────────────┐
│ id                       │ filename                         │ size      │ url          │
├──────────────────────────┼──────────────────────────────────┼───────────┼──────────────┤
│ clh1a2b3c4d5e6f7g8h9i0j  │ product-clh1a2b3c4d5e6f7g8h.jpg  │ SMALL     │ /images/...  │
│ clh1a2b3c4d5e6f7g8h9i0k  │ product-clh1a2b3c4d5e6f7g8h.jpg  │ MEDIUM    │ /images/...  │
│ clh1a2b3c4d5e6f7g8h9i0l  │ product-clh1a2b3c4d5e6f7g8h.jpg  │ LARGE     │ /images/...  │
│ clh1a2b3c4d5e6f7g8h9i0m  │ product-clh1a2b3c4d5e6f7g8h.jpg  │ HOME      │ /images/...  │
└──────────────────────────┴──────────────────────────────────┴───────────┴──────────────┘
```

### 4.2 New Image System Examples

```
Image table:
┌──────────────────────────┬────────────┬──────────────────────┬────────┬──────────────┐
│ id                       │ name       │ filename             │ type   │ imageSize    │
├──────────────────────────┼────────────┼──────────────────────┼────────┼──────────────┤
│ clh1a2b3c4d5e6f7g8h9i0n  │ Perfume 1  │ a1b2c3d4e5f6g7h8.jpg │ PRODUCT│ HOME         │
│ clh1a2b3c4d5e6f7g8h9i0o  │ Brand Logo │ brand-logo-x.png     │ BRAND  │ MEDIUM       │
│ clh1a2b3c4d5e6f7g8h9i0p  │ Category   │ category-y.webp      │ CATEGORY│ SMALL      │
└──────────────────────────┴────────────┴──────────────────────┴────────┴──────────────┘

ProductImageRelation table:
┌──────────────────────────┬──────────────────────────────┬──────────────────────────────┬───────────┐
│ id                       │ productId                    │ imageId                      │ isPrimary │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────┤
│ clh1a2b3c4d5e6f7g8h9i0q  │ clh1a2b3c4d5e6f7g8h9i0z     │ clh1a2b3c4d5e6f7g8h9i0n     │ true      │
└──────────────────────────┴──────────────────────────────┴──────────────────────────────┴───────────┘
```

---

## 5. PHYSICAL FILE STORAGE

### 5.1 Backend Upload Directory

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/uploads/`

**Current Contents:** (~20 images from seeding)
```
backend/uploads/
├── a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p.jpg
├── b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q.jpg
├── c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r.jpg
├── ...
```

### 5.2 Admin Public Images Directory

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/public/images/`

**Current Contents:** (Legacy images from product seeding)
```
admin/public/images/
├── product-clh1a2b3c4d5e6f7g8h.jpg
├── product-clh1a2b3c4d5e6f7g8h2.jpg
├── product-clh1a2b3c4d5e6f7g8h3.jpg
├── ...
```

### 5.3 Frontend Public Images Directory

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/public/images/`

**Contents:**
- `no-image.jpg` - Fallback for missing images
- `placeholder-product.svg` - Error state placeholder

---

## 6. CURRENCY SYSTEM (Related to Display)

### 6.1 Frontend Currency Utilities

**File:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/lib/currency.ts`

```typescript
export const USD_TO_GUARANI_RATE = 7300;

export function usdToGuarani(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_GUARANI_RATE);
}

export function formatGuaraniPrice(guaraniPrice: number): string {
  return `₲${guaraniPrice.toLocaleString('es-PY')}`;
}

export function convertAndFormatPrice(usdPrice: number): string {
  const guaraniPrice = usdToGuarani(usdPrice);
  return formatGuaraniPrice(guaraniPrice);
}

export function formatGuaraniPriceNoDecimals(price: number): string {
  return `Gs ${Math.round(price).toLocaleString('es-PY')}`;
}
```

**Note:** Price display functions support both USD→Guarani conversion and direct Guarani formatting

---

## 7. API ENDPOINTS SUMMARY

### Images Management API

**Base URL:** `http://localhost:3062/api`

#### Image Upload
```
POST /images/upload
Content-Type: multipart/form-data
Authorization: Bearer {JWT}

Body:
- file: File (10MB max, image types only)
- name: string (optional)
- type: ImageType (optional: PRODUCT, BRAND, CATEGORY, OTHER)
- imageSize: ImageSize (optional: SMALL, MEDIUM, LARGE, HOME)
- alt: string (optional)
- tags: string (comma-separated, optional)

Response: 201 Created
{
  "id": "...",
  "name": "...",
  "filename": "...",
  "url": "/uploads/...",
  "type": "PRODUCT",
  "imageSize": "HOME",
  "width": 400,
  "height": 400,
  "size": 45000,
  "mimeType": "image/webp"
}
```

#### List Images
```
GET /images?page=1&limit=20&type=PRODUCT&search=perfume

Response: 200 OK
{
  "images": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "totalPages": 75,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Attach Image to Product
```
POST /images/:imageId/attach/product/:productId
Authorization: Bearer {JWT}
Content-Type: application/json

Body:
{
  "isPrimary": true,
  "sortOrder": 0
}

Response: 200 OK
{
  "productId": "...",
  "imageId": "...",
  "isPrimary": true,
  "image": {...},
  "product": {...}
}
```

### Product Image Upload (Legacy)

**Base URL:** `http://localhost:3062/api`

```
POST /products/:productId/images/:size
Content-Type: multipart/form-data
Authorization: Bearer {JWT}

Parameters:
- :productId - Product ID
- :size - Image size: SMALL, MEDIUM, LARGE, HOME

Body:
- file: File (5MB max, image types only)

Response: 200 OK
{
  "id": "...",
  "filename": "a1b2c3d4e5f6.jpg",
  "size": "HOME",
  "url": "/uploads/a1b2c3d4e5f6.jpg",
  "productId": "..."
}
```

---

## 8. CURRENT LIMITATIONS & ISSUES

### 8.1 Image Path Inconsistencies

| Component | Expected Path | Actual Path | Status |
|-----------|--------------|------------|--------|
| Backend serving | `/uploads/{filename}` | `/uploads/{filename}` | ✓ Correct |
| API response | `/uploads/{filename}` | `/uploads/{filename}` | ✓ Correct |
| Frontend expected | `/images/{filename}` | `/uploads/{filename}` | ✗ Mismatch |
| Admin expected | `/images/{filename}` | Served from admin/public | ✗ Mismatch |

### 8.2 Storage Location Issues

**Issue:** Multiple storage locations for images:
1. Backend uploads → `/backend/uploads/` (new unified system)
2. Product seeding → `/admin/public/images/` (legacy system)
3. Frontend public → `/frontend/public/images/` (static assets)

**Consequence:** Confusion about where to serve images from

### 8.3 Image URL Construction

**Frontend Issue:**
```typescript
// Current (looks for /public/images/)
const imageSrc = `/images/${product.images}`; // This assumes images are in public/images/

// Should be (for API images):
const imageSrc = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.images}`;
```

### 8.4 Legacy vs New System

**Legacy ProductImage:**
- Direct product-image relationship
- One image per size per product
- Used by products controller upload endpoint

**New Image System:**
- Flexible many-to-many relationships
- Supports product, brand, category images
- Better metadata storage
- Not fully integrated into product creation flow

**Gap:** Admin product form still uses legacy image download approach

---

## 9. RECOMMENDED IMPROVEMENTS

### 9.1 Unified Image Serving

**Option 1: Centralized Backend Serving (Recommended)**
- All uploads go to `/backend/uploads/`
- Backend serves via `/uploads` path
- Frontend always requests from API
- Consistent path handling

### 9.2 Image Path Standardization

```typescript
// Frontend image helper
export function getImageUrl(imageUrl: string, baseUrl?: string): string {
  // If already full URL, return as-is
  if (imageUrl?.startsWith('http')) {
    return imageUrl;
  }
  
  // Use API base URL for uploaded files
  const base = baseUrl || process.env.NEXT_PUBLIC_API_URL;
  
  // If path includes /uploads or is relative
  if (imageUrl?.startsWith('/uploads')) {
    return `${base}${imageUrl}`;
  }
  
  // Default to /images for static assets
  return `/images/${imageUrl}`;
}
```

### 9.3 Product Image Form Enhancement

Replace URL-based download with:
1. Direct file upload input
2. Client-side image optimization
3. Integration with new Image system
4. Support multiple images with drag-drop

### 9.4 Database Migration

Move all ProductImage records to new Image+ProductImageRelation structure for consistency

---

## 10. KEY FILES REFERENCE

| Purpose | File Path | Lines |
|---------|-----------|-------|
| Prisma Schema | `backend/prisma/schema.prisma` | 82-236 |
| App Static Config | `backend/src/app.module.ts` | 24-27 |
| Images Controller | `backend/src/images/images.controller.ts` | 24-176 |
| Images Service | `backend/src/images/images.service.ts` | 1-360 |
| Products Controller | `backend/src/products/products.controller.ts` | 207-279 |
| Products Service | `backend/src/products/products.service.ts` | 80-348 |
| Frontend Axios | `frontend/lib/axios.ts` | 1-51 |
| Frontend ProductCard | `frontend/components/ProductCard.tsx` | 1-187 |
| Admin Products Page | `admin/app/admin/products/page.tsx` | 307-333 |
| Admin Add Product | `admin/app/admin/products/add/page.tsx` | 22-137 |
| Frontend Currency | `frontend/lib/currency.ts` | 1-51 |
| Admin Currency | `admin/lib/currency.ts` | 1-76 |

---

## CONCLUSION

The Club de Ofertas platform implements a **sophisticated dual-system approach** to image handling:

1. **Legacy system** for immediate product functionality
2. **New unified system** for future scalability

**Current State:**
- Images upload to backend `/uploads` directory
- Served via NestJS ServeStaticModule at `/uploads` path
- API returns correct URLs
- Frontend/Admin have path construction mismatches

**Recommendation:** Standardize image URL handling across all layers and complete migration to the new Image system for consistent, scalable image management.

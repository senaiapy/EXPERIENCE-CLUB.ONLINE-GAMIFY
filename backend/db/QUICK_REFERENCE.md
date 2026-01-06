# 🚀 Quick Reference - Product Insertion

Quick commands for inserting products into Experience Club database.

## ⚡ Quick Commands

### Insert All Products

```bash
npm run db:insert-products
```

### Insert Single Product

```bash
npm run db:insert-product -- '{
  "id": "1076",
  "referenceId": "000001076",
  "name": "NADIA FERREIRA DAMA EDP 100ML",
  "price": "350000",
  "specifications": "NADIA-FERREIRA-DAMA-EDP-100ML",
  "stockStatus": "En stock",
  "category": "fragrancia femenina",
  "brand_name": "NADIA FERREIRA",
  "images": "3556.jpg",
  "price_sale": "118125"
}'
```

### Preview (Dry Run)

```bash
npm run db:insert-dry-run
```

## 📋 Required Fields

| Field | Required | Example | Description |
|-------|----------|---------|-------------|
| `id` | ✅ Yes | `"1076"` | Unique product ID |
| `name` | ✅ Yes | `"PRODUCT NAME"` | Product name |
| `price` | ✅ Yes | `"350000"` | Price in Guaraníes (₲) |
| `specifications` | Recommended | `"product-slug"` | Used for URL slug |
| `stockStatus` | Recommended | `"En stock"` | Stock status |
| `category` | Recommended | `"fragrancia femenina"` | Category name |
| `brand_name` | Recommended | `"BRAND NAME"` | Brand name |
| `images` | Recommended | `"image.jpg"` | Image filename |
| `referenceId` | Optional | `"000001076"` | Reference code |
| `description` | Optional | `"Description text"` | Product description |
| `details` | Optional | `"Detail text"` | Additional details |
| `tags` | Optional | `"tag1,tag2"` | Comma-separated tags |
| `price_sale` | Optional | `"118125"` | Sale price in Guaraníes |

## 🔄 What Happens Automatically

1. **Price Conversion**: ₲350,000 → $47.95 USD (÷ 7,300)
2. **Slug Generation**: "NADIA FERREIRA DAMA" → "nadia-ferreira-dama-edp-100ml"
3. **Stock Parsing**: "En stock" → 10 units
4. **Brand Creation**: Creates brand "NADIA FERREIRA" if doesn't exist
5. **Category Creation**: Creates category "fragrancia femenina" if doesn't exist
6. **Image Creation**: Creates SMALL, MEDIUM, LARGE, HOME image variants

## 📊 Output Example

```
[1/1] Processing: NADIA FERREIRA DAMA EDP 100ML
   💰 Price: ₲350000 → $47.95 USD
   📦 Stock: 10 (En stock)
   🏷️  Brand: NADIA FERREIRA
   📂 Category: fragrancia femenina
   📷 Created images: SMALL, MEDIUM, LARGE, HOME
   ✅ Product inserted/updated: cmh57vhmw0003sq18mip3vgtv

✅ Successfully inserted product
```

## 🎯 Common Use Cases

### Add New Product

```bash
npm run db:insert-product -- '{
  "id": "9999",
  "name": "NEW PERFUME EDT 100ML",
  "price": "450000",
  "specifications": "new-perfume-edt-100ml",
  "stockStatus": "En stock",
  "category": "fragrancia masculina",
  "brand_name": "NEW BRAND",
  "images": "new-perfume.jpg"
}'
```

### Update Existing Product (Same Slug)

```bash
npm run db:insert-product -- '{
  "id": "1076",
  "name": "UPDATED NAME",
  "price": "400000",
  "specifications": "NADIA-FERREIRA-DAMA-EDP-100ML",
  "stockStatus": "Agotado",
  "category": "fragrancia femenina",
  "brand_name": "NADIA FERREIRA",
  "images": "updated-image.jpg"
}'
```

### Using Example File

```bash
# Edit example-product.json with your product data
npm run db:insert-products -- --file backend/db/example-product.json
```

## 🔍 Verification

### Check Database

```bash
# Open Prisma Studio
npm run prisma:studio

# Browse to http://localhost:5555
# Navigate to Product table
# Search for your product
```

### Query API

```bash
# Get all products
curl http://localhost:3062/api/products?page=1&limit=10

# Get specific product by slug
curl http://localhost:3062/api/products/slug/nadia-ferreira-dama-edp-100ml
```

## ⚠️ Important Notes

- **Database must be running**: `npm run dev:start`
- **Migrations must be applied**: `npm run docker:migrate:dev`
- **Prices in Guaraníes**: Backend stores USD, auto-converted
- **Upsert logic**: Updates if slug exists, creates if new
- **Brand/Category**: Auto-created if missing

## 📚 Full Documentation

- **Complete Guide**: [INSERT_PRODUCTS_GUIDE.md](./INSERT_PRODUCTS_GUIDE.md)
- **Database Info**: [README.md](./README.md)
- **Project Docs**: [/CLAUDE.md](/CLAUDE.md)

## 💡 Tips

1. **Always test with dry-run first** for new data
2. **Use unique specifications** to avoid slug conflicts
3. **Price in Guaraníes**: Script auto-converts to USD
4. **Stock status**: Use "En stock" or "Agotado"
5. **Images**: Place in `frontend/public/images/` and `admin/public/images/`

# 📦 Product Insertion Guide - Experience Club

Quick guide for inserting products from JSON into PostgreSQL database.

## 🚀 Quick Start

### Insert All Products from products.json

```bash
# From project root
node backend/db/insert-products.js

# Or from backend directory
cd backend
node db/insert-products.js
```

### Insert Single Product

```bash
# From project root
node backend/db/insert-products.js --single '{
  "id": "1076",
  "referenceId": "000001076",
  "name": "NADIA FERREIRA DAMA EDP 100ML",
  "price": "350000",
  "specifications": "NADIA-FERREIRA-DAMA-EDP-100ML",
  "stockStatus": "En stock",
  "details": "",
  "tags": "",
  "category": "fragrancia femenina",
  "brand_name": "NADIA FERREIRA",
  "description": "",
  "images": "3556.jpg",
  "price_sale": "350000"
}'
```

### Preview Without Inserting (Dry Run)

```bash
node backend/db/insert-products.js --dry-run
```

## 📋 Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--single <json>` | Insert a single product from JSON string | `--single '{"id":"1076",...}'` |
| `--file <path>` | Use custom JSON file (default: products.json) | `--file ./my-products.json` |
| `--batch <size>` | Batch size for processing (default: 50) | `--batch 100` |
| `--dry-run` | Preview without inserting | `--dry-run` |

## 🔧 Features

### Automatic Data Processing

1. **Price Conversion**: Guaraní → USD (÷ 7,300)
   - Input: `"price": "350000"` (₲350,000)
   - Output: `35.62` USD in database

2. **Slug Generation**: Auto-generates SEO-friendly slugs
   - Input: `"NADIA FERREIRA DAMA EDP 100ML"`
   - Output: `nadia-ferreira-dama-edp-100ml`

3. **Stock Parsing**: Converts status to quantity
   - `"En stock"` → 10 units
   - `"Agotado"` → 0 units

4. **Brand/Category Creation**: Auto-creates if missing
   - Finds existing or creates new brand
   - Finds existing or creates new category

5. **Image Handling**: Creates legacy ProductImage system
   - SMALL, MEDIUM, LARGE, HOME sizes
   - Uses first image from comma-separated list

### Database Operations

- **Upsert Logic**: Updates if exists, creates if new (based on slug)
- **Batch Processing**: Processes 50 products at a time (configurable)
- **Transaction Safety**: Uses Prisma's built-in transaction handling
- **Error Handling**: Continues on individual failures, reports at end

## 📊 Example Output

```
🚀 Experience Club - Product Insertion Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Connected to PostgreSQL database via Prisma

📁 Reading products from: /path/to/products.json

📊 Total products to process: 1075
📦 Batch size: 50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Batch 1/22 - Processing 50 products...

[1/1075] Processing: NADIA FERREIRA DAMA EDP 100ML
   💰 Price: ₲350000 → $47.95 USD
   📦 Stock: 10 (En stock)
   🏷️  Brand: NADIA FERREIRA
   📂 Category: fragrancia femenina
   📷 Created images: SMALL, MEDIUM, LARGE, HOME
   ✅ Product inserted/updated: clx1234567890

✅ Batch 1 completed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Insertion Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Successful: 1075
❌ Failed: 0
⏱️  Duration: 45.32s

📊 Database Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Products: 1075
🏷️  Brands: 579
📂 Categories: 18
✅ In Stock: 1075

💰 Price Statistics (USD):
   Average: $52.37
   Minimum: $5.48
   Maximum: $269.86

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Database connection closed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 Use Cases

### 1. Initial Database Setup

```bash
# Make sure Docker is running
npm run dev:start

# Insert all products from products.json
node backend/db/insert-products.js
```

### 2. Add New Product

```bash
# Insert single product
node backend/db/insert-products.js --single '{
  "id": "1076",
  "name": "NEW PRODUCT NAME",
  "price": "450000",
  "specifications": "new-product-slug",
  "stockStatus": "En stock",
  "category": "fragrancia femenina",
  "brand_name": "BRAND NAME",
  "images": "new-image.jpg",
  "price_sale": "400000"
}'
```

### 3. Update Existing Product

```bash
# Same command as add - upsert will update based on slug
node backend/db/insert-products.js --single '{...}'
```

### 4. Import Custom File

```bash
# Create custom JSON file with product array
node backend/db/insert-products.js --file ./my-custom-products.json
```

### 5. Test Before Inserting

```bash
# Preview what will be inserted
node backend/db/insert-products.js --dry-run

# Preview single product
node backend/db/insert-products.js --single '{...}' --dry-run
```

## 🔍 Verification

After insertion, verify data in database:

### Using Prisma Studio

```bash
npm run prisma:studio
```

Then browse to http://localhost:5555

### Using psql

```bash
# Connect to database
docker-compose -f docker-compose.dev.yml exec postgres psql -U clubdeofertas -d clubdeofertas

# Check product count
SELECT COUNT(*) FROM "Product";

# View recent products
SELECT id, name, price, "stockStatus" FROM "Product" ORDER BY "createdAt" DESC LIMIT 10;

# Check specific product
SELECT * FROM "Product" WHERE slug = 'nadia-ferreira-dama-edp-100ml';
```

### Using Backend API

```bash
# Get all products
curl http://localhost:3062/api/products?page=1&limit=10

# Get specific product by slug
curl http://localhost:3062/api/products/slug/nadia-ferreira-dama-edp-100ml
```

## ⚠️ Important Notes

### Prerequisites

1. **Database must be running**:
   ```bash
   npm run dev:start
   # or
   docker-compose -f docker-compose.dev.yml up -d postgres
   ```

2. **Prisma must be initialized**:
   ```bash
   npm run docker:migrate:dev
   ```

3. **Run from correct directory**:
   ```bash
   # Option 1: From project root
   node backend/db/insert-products.js

   # Option 2: From backend directory
   cd backend && node db/insert-products.js
   ```

### Data Mapping

JSON Field → Database Field:
- `price` (Guaraní) → `price` (USD, divided by 7300)
- `specifications` → `slug` (auto-generated if missing)
- `stockStatus` → `stock` (10 if "En stock", 0 if not)
- `brand_name` → Creates/finds `Brand`, links via `brandId`
- `category` → Creates/finds `Category`, links via `categoryId`
- `images` → Creates `ProductImage` for SMALL, MEDIUM, LARGE, HOME

### Error Handling

- Script continues on individual product failures
- All errors are reported at the end
- Successful products are still inserted even if some fail
- Upsert prevents duplicate errors (updates instead)

## 🐛 Troubleshooting

### Error: Cannot find module '@prisma/client'

```bash
# Install dependencies
cd backend
npm install

# Generate Prisma client
npx prisma generate
```

### Error: Can't reach database server

```bash
# Start database
npm run dev:start

# Check database is running
npm run dev:ps

# Check logs
npm run dev:logs
```

### Error: Table 'Product' does not exist

```bash
# Run migrations
npm run docker:migrate:dev
```

### Error: Unique constraint failed on slug

This means a product with that slug already exists. The script uses upsert, so it should update instead. If you see this error:

1. Check if slug generation is producing duplicates
2. Modify the product's specifications field to be unique
3. Delete the existing product and re-run

### Error: Invalid JSON in --single argument

Make sure to:
1. Use single quotes around the JSON: `--single '{...}'`
2. Use double quotes inside JSON: `{"key": "value"}`
3. Escape inner quotes if needed: `--single "{\"key\": \"value\"}"`

## 📚 Related Files

- **Script**: [/backend/db/insert-products.js](./insert-products.js)
- **Data Source**: [/backend/db/products.json](./products.json)
- **Prisma Schema**: [/backend/prisma/schema.prisma](../prisma/schema.prisma)
- **Legacy Script**: [/backend/db/generate-product-sql.js](./generate-product-sql.js)

## 🔗 NPM Scripts (Recommended)

Add to root `package.json`:

```json
{
  "scripts": {
    "db:insert-products": "node backend/db/insert-products.js",
    "db:insert-product": "node backend/db/insert-products.js --single",
    "db:insert-dry-run": "node backend/db/insert-products.js --dry-run"
  }
}
```

Then use:

```bash
npm run db:insert-products
npm run db:insert-product -- '{"id":"1076",...}'
npm run db:insert-dry-run
```

## ✅ Best Practices

1. **Always test with dry-run first** for new data
2. **Use single product mode** when adding/updating one product
3. **Batch size**: Keep at 50 for good balance of speed/memory
4. **Backup database** before bulk operations
5. **Verify results** using Prisma Studio or psql
6. **Monitor logs** for warnings about missing images/brands

## 📞 Support

If you encounter issues:

1. Check [CLAUDE.md](/CLAUDE.md) for project documentation
2. Review [backend/db/README.md](./README.md) for database info
3. Check Docker logs: `npm run dev:logs`
4. Verify database connection: `npm run prisma:studio`

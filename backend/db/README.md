# 📦 Database Files - Experience Club

This directory contains database-related files for the Experience Club e-commerce platform.

## 📁 Files

### 1. `products.json` (476 KB)
- **Source**: Legacy product data
- **Format**: JSON array
- **Total Products**: 1,075
- **Fields**:
  - `id` - Product ID
  - `referenceId` - Reference code
  - `name` - Product name
  - `price` - Price in Guaraníes (₲)
  - `price_sale` - Sale price in Guaraníes
  - `specifications` - Product slug/specifications
  - `stockStatus` - Stock availability ("En stock" / "Agotado")
  - `details` - Product details
  - `tags` - Product tags
  - `category` - Category name
  - `brand_name` - Brand name
  - `description` - Product description
  - `images` - Image filenames (comma-separated)

### 2. `Product_clubofertas.sql` (340 KB)
- **Generated from**: `products.json`
- **Type**: PostgreSQL SQL script
- **Purpose**: Create and populate `Product_clubofertas` table
- **Features**:
  - DROP TABLE IF EXISTS
  - CREATE TABLE with schema matching Prisma Product model
  - Indexes for performance optimization
  - INSERT statements with ON CONFLICT handling
  - Price conversion from Guaraníes (₲) to USD
  - Data validation queries

### 3. `generate-product-sql.js`
- **Type**: Node.js script
- **Purpose**: Generate SQL file from products.json
- **Usage**: `node generate-product-sql.js` or `npm run db:generate-sql`
- **Features**:
  - Reads products.json
  - Converts prices from Guaraní to USD (÷ 7300)
  - Generates SQL INSERT statements
  - Batches inserts (100 products per batch)
  - Creates slugs from product names
  - Handles NULL values
  - Escapes SQL strings

### 4. `insert-products.js` ⭐ **RECOMMENDED**
- **Type**: Node.js script with Prisma
- **Purpose**: Insert products directly into PostgreSQL via Prisma ORM
- **Usage**: `node insert-products.js` or `npm run db:insert-products`
- **Features**:
  - ✅ Direct database insertion via Prisma
  - ✅ Automatic brand/category creation
  - ✅ Price conversion (Guaraní → USD)
  - ✅ Legacy ProductImage system support (SMALL, MEDIUM, LARGE, HOME)
  - ✅ Upsert logic (updates existing, creates new)
  - ✅ Single product or batch insertion
  - ✅ Progress tracking and statistics
  - ✅ Dry-run mode for testing
  - ✅ Error handling and reporting
- **See**: [INSERT_PRODUCTS_GUIDE.md](./INSERT_PRODUCTS_GUIDE.md) for complete documentation

### 5. `example-product.json`
- **Type**: Example JSON file
- **Purpose**: Template for single product insertion
- **Usage**: Use as reference when adding new products

## 🚀 Quick Start

### **Option 1: Insert via Prisma (RECOMMENDED)**

```bash
# Insert all products from products.json
npm run db:insert-products

# Insert single product
npm run db:insert-product -- '{"id":"1076","name":"Product Name",...}'

# Dry run (preview without inserting)
npm run db:insert-dry-run
```

See [INSERT_PRODUCTS_GUIDE.md](./INSERT_PRODUCTS_GUIDE.md) for detailed usage.

### **Option 2: Generate SQL File (Legacy)**

### Generate SQL File

```bash
cd backend/db
node generate-product-sql.js
```

**Output**: `Product_clubofertas.sql`

### Import to PostgreSQL

```bash
# Option 1: Using psql command line
psql -U clubdeofertas -d clubdeofertas -f Product_clubofertas.sql

# Option 2: Using Docker
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas -f /path/to/Product_clubofertas.sql

# Option 3: Copy and paste in psql
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas
# Then paste the SQL content
```

## 📊 Database Schema

### Table: `Product_clubofertas`

```sql
CREATE TABLE "Product_clubofertas" (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price DOUBLE PRECISION NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    "brandId" VARCHAR(255),
    "categoryId" VARCHAR(255),
    "referenceId" VARCHAR(255),
    specifications TEXT,
    details TEXT,
    price_sale VARCHAR(255),
    "stockStatus" VARCHAR(255) NOT NULL DEFAULT 'Agotado',
    "stockQuantity" VARCHAR(255),
    image_name VARCHAR(255),
    brand_name VARCHAR(255),
    tags TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes Created

- `idx_product_slug` - On slug column
- `idx_product_price` - On price column
- `idx_product_stock_status` - On stockStatus column
- `idx_product_brand_name` - On brand_name column
- `idx_product_created_at` - On createdAt column (DESC)

## 💱 Price Conversion

All prices are converted from Guaraníes (₲) to USD during SQL generation:

- **Exchange Rate**: 1 USD = 7,300 Guaraníes
- **Formula**: `USD = Guaraní ÷ 7,300`

**Examples:**
- ₲265,000 → $36.30 USD
- ₲615,000 → $84.25 USD
- ₲1,970,000 → $269.86 USD

## 📈 Statistics

### From products.json
- **Total Products**: 1,075
- **Total Brands**: ~579 (estimated from brand_name)
- **Total Categories**: ~18 (estimated from category)
- **Products In Stock**: ~1,075 (most marked "En stock")

### After Import
Run verification query:

```sql
SELECT
    COUNT(*) as total_products,
    COUNT(DISTINCT brand_name) as total_brands,
    COUNT(CASE WHEN "stockStatus" LIKE '%stock%' THEN 1 END) as in_stock,
    AVG(price) as avg_price_usd,
    MIN(price) as min_price_usd,
    MAX(price) as max_price_usd
FROM "Product_clubofertas";
```

## 🔍 Sample Queries

### Get all products
```sql
SELECT * FROM "Product_clubofertas"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Get products by brand
```sql
SELECT * FROM "Product_clubofertas"
WHERE brand_name LIKE '%LATTAFA%'
ORDER BY price DESC;
```

### Get products in stock
```sql
SELECT * FROM "Product_clubofertas"
WHERE "stockStatus" LIKE '%stock%'
ORDER BY price ASC;
```

### Get price range
```sql
SELECT
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price
FROM "Product_clubofertas";
```

### Top 10 most expensive products
```sql
SELECT id, name, brand_name, price, "stockStatus"
FROM "Product_clubofertas"
ORDER BY price DESC
LIMIT 10;
```

## 🔄 Regenerating SQL

If you modify `products.json`, regenerate the SQL file:

```bash
cd backend/db
node generate-product-sql.js
```

This will:
1. Read updated products.json
2. Generate new SQL file
3. Overwrite existing Product_clubofertas.sql
4. Display generation statistics

## 🛠️ Customization

### Modify Exchange Rate

Edit `generate-product-sql.js`:

```javascript
function convertToUSD(guaraniPrice) {
  const price = parseFloat(String(guaraniPrice).replace(/[^\d.]/g, ''));
  if (isNaN(price)) return 0;
  return (price / 7300).toFixed(2); // Change 7300 to your rate
}
```

### Change Batch Size

Edit `generate-product-sql.js`:

```javascript
const batchSize = 100; // Change to 50, 200, etc.
```

### Modify Table Name

Edit `generate-product-sql.js` and replace all instances of `"Product_clubofertas"` with your desired table name.

## 🐛 Troubleshooting

### Error: Permission denied
```bash
# Grant execute permission to script
chmod +x generate-product-sql.js
```

### Error: Cannot find module
```bash
# Install Node.js if not installed
# Or run from project root with proper node_modules
cd ../..
node backend/db/generate-product-sql.js
```

### Error: File not found (psql)
```bash
# Use absolute path
psql -U clubdeofertas -d clubdeofertas -f /absolute/path/to/Product_clubofertas.sql
```

### Error: Duplicate key violation
This means table already exists with data. Either:

1. **Drop and recreate** (SQL file does this automatically)
2. **Or update** instead of insert (SQL file has ON CONFLICT clause)

## 📝 Notes

- **Prices**: Stored in USD in database, converted to Guaraníes (₲) in frontend using `/lib/currency.ts`
- **Stock**: Set to 10 for products with "En stock", 0 for "Agotado"
- **Slugs**: Auto-generated from product name or specifications
- **Images**: Only first image filename stored in `image_name` column
- **Tags**: Converted to PostgreSQL TEXT[] array

## 🔗 Related Files

- **Prisma Schema**: `backend/prisma/schema.prisma` - Product model definition
- **Frontend Currency**: `frontend/lib/currency.ts` - USD to Guaraní conversion
- **Backend API**: `backend/src/products/` - Product API endpoints

## ✅ Verification

After importing SQL:

1. **Check table exists**:
   ```sql
   \dt Product_clubofertas
   ```

2. **Count products**:
   ```sql
   SELECT COUNT(*) FROM "Product_clubofertas";
   ```

3. **View sample**:
   ```sql
   SELECT * FROM "Product_clubofertas" LIMIT 5;
   ```

4. **Check indexes**:
   ```sql
   \di Product_clubofertas*
   ```

## 📚 Documentation

For more information:
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Project README**: `/CLAUDE.md`

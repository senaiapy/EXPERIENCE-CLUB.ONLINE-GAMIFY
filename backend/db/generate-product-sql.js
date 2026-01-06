/**
 * Generate SQL file for Product_clubofertas table
 * Reads products.json and creates PostgreSQL INSERT statements
 */

const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Loaded ${products.length} products from products.json`);

// Helper function to escape SQL strings
function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// Helper function to convert Guaraní price to USD (divide by 7300)
function convertToUSD(guaraniPrice) {
  const price = parseFloat(String(guaraniPrice).replace(/[^\d.]/g, ''));
  if (isNaN(price)) return 0;
  return (price / 7300).toFixed(2);
}

// Generate SQL file
let sql = `-- =========================================
-- Product_clubofertas Table - PostgreSQL
-- Generated from products.json
-- Total Products: ${products.length}
-- =========================================

-- Drop table if exists
DROP TABLE IF EXISTS "Product_clubofertas" CASCADE;

-- Create table matching Prisma Product schema
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

-- Create indexes for better query performance
CREATE INDEX idx_product_slug ON "Product_clubofertas"(slug);
CREATE INDEX idx_product_price ON "Product_clubofertas"(price);
CREATE INDEX idx_product_stock_status ON "Product_clubofertas"("stockStatus");
CREATE INDEX idx_product_brand_name ON "Product_clubofertas"(brand_name);
CREATE INDEX idx_product_created_at ON "Product_clubofertas"("createdAt" DESC);

-- Add comment
COMMENT ON TABLE "Product_clubofertas" IS 'Products table generated from legacy products.json data';

-- =========================================
-- INSERT STATEMENTS
-- =========================================

`;

// Generate INSERT statements in batches of 100
const batchSize = 100;
let insertCount = 0;

for (let i = 0; i < products.length; i += batchSize) {
  const batch = products.slice(i, i + batchSize);

  sql += `-- Batch ${Math.floor(i / batchSize) + 1} (Products ${i + 1} to ${Math.min(i + batchSize, products.length)})\n`;
  sql += `INSERT INTO "Product_clubofertas" (id, name, slug, description, price, stock, "referenceId", specifications, details, price_sale, "stockStatus", "stockQuantity", image_name, brand_name, tags, "isFeatured", "createdAt", "updatedAt") VALUES\n`;

  const values = batch.map((product, idx) => {
    insertCount++;

    // Generate slug from name or specifications
    const slug = (product.specifications || product.name || `product-${product.id}`)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Convert price from Guaraní to USD
    const priceUSD = convertToUSD(product.price);

    // Determine stock quantity
    const stockStatus = product.stockStatus || 'Agotado';
    const stock = stockStatus.toLowerCase().includes('stock') || stockStatus.toLowerCase().includes('en stock') ? 10 : 0;

    // Parse tags
    const tags = product.tags ? `ARRAY[${product.tags.split(',').map(t => escapeSqlString(t.trim())).join(',')}]` : 'ARRAY[]::TEXT[]';

    // Extract image name from images field
    const imageName = product.images ? product.images.split(',')[0].trim() : null;

    return `    (${escapeSqlString(product.id)}, ${escapeSqlString(product.name)}, ${escapeSqlString(slug)}, ${escapeSqlString(product.description || '')}, ${priceUSD}, ${stock}, ${escapeSqlString(product.referenceId)}, ${escapeSqlString(product.specifications)}, ${escapeSqlString(product.details)}, ${escapeSqlString(product.price_sale)}, ${escapeSqlString(stockStatus)}, ${escapeSqlString(stock.toString())}, ${escapeSqlString(imageName)}, ${escapeSqlString(product.brand_name)}, ${tags}, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  }).join(',\n');

  sql += values + '\n';
  sql += 'ON CONFLICT (id) DO UPDATE SET\n';
  sql += '    name = EXCLUDED.name,\n';
  sql += '    price = EXCLUDED.price,\n';
  sql += '    stock = EXCLUDED.stock,\n';
  sql += '    "updatedAt" = CURRENT_TIMESTAMP;\n\n';
}

sql += `-- =========================================
-- SUMMARY
-- =========================================
-- Total products inserted: ${insertCount}
-- Table: Product_clubofertas
-- Schema matches: backend/prisma/schema.prisma Product model
-- Price conversion: Guaraní to USD (÷ 7300)
-- =========================================

-- Verify insertion
SELECT
    COUNT(*) as total_products,
    COUNT(DISTINCT brand_name) as total_brands,
    COUNT(CASE WHEN "stockStatus" LIKE '%stock%' THEN 1 END) as in_stock,
    AVG(price) as avg_price_usd,
    MIN(price) as min_price_usd,
    MAX(price) as max_price_usd
FROM "Product_clubofertas";

-- Sample products
SELECT id, name, brand_name, price, "stockStatus"
FROM "Product_clubofertas"
ORDER BY price DESC
LIMIT 10;
`;

// Write SQL file
const outputPath = path.join(__dirname, 'Product_clubofertas.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

console.log(`✅ SQL file generated: ${outputPath}`);
console.log(`📊 Total INSERT statements: ${insertCount}`);
console.log(`📦 Batch size: ${batchSize} products per batch`);
console.log(`💾 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

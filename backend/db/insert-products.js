#!/usr/bin/env node
/**
 * Insert Products Script - Experience Club
 *
 * Purpose: Insert products from products.json into PostgreSQL database via Prisma
 *
 * Features:
 * - Reads products.json
 * - Stores prices in Guaraníes (no conversion)
 * - Creates/finds brands and categories
 * - Creates products with proper relations
 * - Handles legacy ProductImage system (SMALL, MEDIUM, LARGE, HOME)
 * - Batch processing for performance
 * - Progress tracking
 * - Error handling and rollback
 *
 * Usage:
 *   node backend/db/insert-products.js
 *   node backend/db/insert-products.js --single '{"id":"1076",...}'
 *
 * Options:
 *   --single <json>  Insert a single product from JSON string
 *   --file <path>    Use custom JSON file (default: products.json)
 *   --batch <size>   Batch size for processing (default: 50)
 *   --dry-run        Preview without inserting
 */

const fs = require('fs');
const path = require('path');

// =========================================
// Configuration
// =========================================

const CONFIG = {
  batchSize: 50,
  defaultStock: 10,
  outOfStockValue: 0,
  imageSizes: ['SMALL', 'MEDIUM', 'LARGE', 'HOME'],
};

// =========================================
// Prisma Client Setup
// =========================================

// Import PrismaClient dynamically
let PrismaClient;
let prisma;

async function initPrisma() {
  try {
    // Try to import PrismaClient - check multiple paths
    let PC;
    try {
      // Try from @prisma/client (most common)
      PC = require('@prisma/client').PrismaClient;
    } catch (err) {
      // Try relative path from backend directory
      const backendPath = path.join(__dirname, '..');
      const prismaPath = path.join(backendPath, 'node_modules/@prisma/client');
      PC = require(prismaPath).PrismaClient;
    }

    PrismaClient = PC;
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });

    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma\n');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Prisma:');
    console.error('   Make sure you have run: cd backend && npm install');
    console.error('   And run migrations: npm run docker:migrate:dev');
    console.error('   Error:', error.message);
    process.exit(1);
  }
}

// =========================================
// Helper Functions
// =========================================

/**
 * Parse price - keep as Guaraníes (no conversion to USD)
 */
function parsePrice(guaraniPrice) {
  const price = parseFloat(String(guaraniPrice).replace(/[^\d.]/g, ''));
  if (isNaN(price) || price <= 0) return 0;
  return price; // Return Guaraníes directly, no conversion
}

/**
 * Generate slug from text
 */
function generateSlug(text, fallbackId = '') {
  if (!text) return `product-${fallbackId}`;

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse stock quantity from status
 */
function parseStock(stockStatus) {
  if (!stockStatus) return CONFIG.outOfStockValue;

  const status = stockStatus.toLowerCase();
  if (status.includes('en stock') || status.includes('disponible')) {
    return CONFIG.defaultStock;
  }

  return CONFIG.outOfStockValue;
}

/**
 * Parse tags array
 */
function parseTags(tagsString) {
  if (!tagsString || tagsString.trim() === '') return [];

  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Create or find brand by name
 */
async function findOrCreateBrand(brandName) {
  if (!brandName || brandName.trim() === '') return null;

  const slug = generateSlug(brandName);

  const brand = await prisma.brand.upsert({
    where: { slug },
    update: {},
    create: {
      name: brandName.trim(),
      slug,
    },
  });

  return brand.id;
}

/**
 * Create or find category by name
 */
async function findOrCreateCategory(categoryName) {
  if (!categoryName || categoryName.trim() === '') return null;

  const slug = generateSlug(categoryName);

  const category = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: {
      name: categoryName.trim(),
      slug,
    },
  });

  return category.id;
}

/**
 * Create product images (legacy ProductImage system)
 */
async function createProductImages(productId, imageFilename) {
  if (!imageFilename) return;

  const images = [];

  for (const size of CONFIG.imageSizes) {
    try {
      await prisma.productImage.upsert({
        where: {
          productId_size: {
            productId,
            size,
          },
        },
        update: {
          filename: imageFilename,
          url: imageFilename, // Just the filename, frontend adds /images/ prefix
        },
        create: {
          productId,
          filename: imageFilename,
          size,
          url: imageFilename, // Just the filename, frontend adds /images/ prefix
        },
      });
      images.push(size);
    } catch (error) {
      console.warn(`   ⚠️  Failed to create ${size} image: ${error.message}`);
    }
  }

  if (images.length > 0) {
    console.log(`   📷 Created images: ${images.join(', ')}`);
  }
}

/**
 * Insert single product
 */
async function insertProduct(productData, index = 0, total = 0) {
  const progress = total > 0 ? `[${index + 1}/${total}]` : '';

  try {
    // Parse product data - keep prices in Guaraníes
    const priceGs = parsePrice(productData.price);
    const priceSaleGs = productData.price_sale ? parsePrice(productData.price_sale) : null;
    const stock = parseStock(productData.stockStatus);
    const tags = parseTags(productData.tags);
    const slug = generateSlug(productData.specifications || productData.name, productData.id);

    // Get or create brand
    const brandId = await findOrCreateBrand(productData.brand_name);

    // Get or create category
    const categoryId = await findOrCreateCategory(productData.category);

    // Extract first image filename
    const imageFilename = productData.images ? productData.images.split(',')[0].trim() : null;

    console.log(`${progress} Processing: ${productData.name}`);
    console.log(`   💰 Price: ₲${productData.price} (stored as ₲${priceGs})`);
    console.log(`   📦 Stock: ${stock} (${productData.stockStatus})`);
    if (brandId) console.log(`   🏷️  Brand: ${productData.brand_name}`);
    if (categoryId) console.log(`   📂 Category: ${productData.category}`);

    // Create or update product
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: productData.name,
        description: productData.description || '',
        price: priceGs,
        stock,
        brandId,
        categoryId,
        referenceId: productData.referenceId,
        specifications: productData.specifications,
        details: productData.details,
        price_sale: priceSaleGs ? priceSaleGs.toString() : null,
        stockStatus: productData.stockStatus || 'Agotado',
        stockQuantity: stock.toString(),
        image_name: imageFilename,
        brand_name: productData.brand_name,
        tags,
        updatedAt: new Date(),
      },
      create: {
        name: productData.name,
        slug,
        description: productData.description || '',
        price: priceGs,
        stock,
        brandId,
        categoryId,
        referenceId: productData.referenceId,
        specifications: productData.specifications,
        details: productData.details,
        price_sale: priceSaleGs ? priceSaleGs.toString() : null,
        stockStatus: productData.stockStatus || 'Agotado',
        stockQuantity: stock.toString(),
        image_name: imageFilename,
        brand_name: productData.brand_name,
        tags,
      },
    });

    // Create product images (legacy system)
    if (imageFilename) {
      await createProductImages(product.id, imageFilename);
    }

    console.log(`   ✅ Product inserted/updated: ${product.id}\n`);

    return { success: true, productId: product.id };
  } catch (error) {
    console.error(`   ❌ Failed to insert product: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Insert products in batches
 */
async function insertProductsBatch(products, batchSize = CONFIG.batchSize) {
  const total = products.length;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  console.log(`📊 Total products to process: ${total}`);
  console.log(`📦 Batch size: ${batchSize}\n`);
  console.log('━'.repeat(60) + '\n');

  for (let i = 0; i < total; i += batchSize) {
    const batch = products.slice(i, Math.min(i + batchSize, total));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(total / batchSize);

    console.log(`📦 Batch ${batchNum}/${totalBatches} - Processing ${batch.length} products...\n`);

    for (let j = 0; j < batch.length; j++) {
      const result = await insertProduct(batch[j], i + j, total);

      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        errors.push({
          product: batch[j].name,
          error: result.error,
        });
      }
    }

    console.log(`✅ Batch ${batchNum} completed\n`);
    console.log('━'.repeat(60) + '\n');
  }

  return { successCount, errorCount, errors };
}

/**
 * Print summary statistics
 */
async function printSummary() {
  console.log('\n📊 Database Summary:');
  console.log('━'.repeat(60));

  const productCount = await prisma.product.count();
  const brandCount = await prisma.brand.count();
  const categoryCount = await prisma.category.count();
  const inStockCount = await prisma.product.count({
    where: {
      stock: { gt: 0 },
    },
  });

  const priceStats = await prisma.product.aggregate({
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
  });

  console.log(`\n📦 Products: ${productCount}`);
  console.log(`🏷️  Brands: ${brandCount}`);
  console.log(`📂 Categories: ${categoryCount}`);
  console.log(`✅ In Stock: ${inStockCount}`);
  console.log(`\n💰 Price Statistics (USD):`);
  console.log(`   Average: $${priceStats._avg.price?.toFixed(2) || 0}`);
  console.log(`   Minimum: $${priceStats._min.price?.toFixed(2) || 0}`);
  console.log(`   Maximum: $${priceStats._max.price?.toFixed(2) || 0}`);
  console.log('\n' + '━'.repeat(60));
}

// =========================================
// Main Function
// =========================================

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let singleProduct = null;
  let productsFile = path.join(__dirname, 'products.json');
  let batchSize = CONFIG.batchSize;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--single' && args[i + 1]) {
      singleProduct = JSON.parse(args[i + 1]);
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      productsFile = args[i + 1];
      i++;
    } else if (args[i] === '--batch' && args[i + 1]) {
      batchSize = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  console.log('\n🚀 Experience Club - Product Insertion Script');
  console.log('━'.repeat(60) + '\n');

  // Initialize Prisma
  await initPrisma();

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  // Handle single product insertion
  if (singleProduct) {
    console.log('📝 Single product mode\n');

    if (dryRun) {
      console.log('Product preview:', JSON.stringify(singleProduct, null, 2));
      console.log('\n✅ Dry run completed - no changes made');
    } else {
      const result = await insertProduct(singleProduct);

      if (result.success) {
        console.log(`✅ Successfully inserted product: ${result.productId}`);
        await printSummary();
      } else {
        console.error(`❌ Failed to insert product: ${result.error}`);
        process.exit(1);
      }
    }

    await prisma.$disconnect();
    return;
  }

  // Handle batch insertion from file
  if (!fs.existsSync(productsFile)) {
    console.error(`❌ Products file not found: ${productsFile}`);
    process.exit(1);
  }

  console.log(`📁 Reading products from: ${productsFile}\n`);

  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  if (!Array.isArray(products) || products.length === 0) {
    console.error('❌ Invalid products file - must be a non-empty array');
    process.exit(1);
  }

  if (dryRun) {
    console.log(`📊 Found ${products.length} products`);
    console.log('\nFirst product preview:', JSON.stringify(products[0], null, 2));
    console.log('\n✅ Dry run completed - no changes made');
    await prisma.$disconnect();
    return;
  }

  // Insert products
  const startTime = Date.now();
  const { successCount, errorCount, errors } = await insertProductsBatch(products, batchSize);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print results
  console.log('\n🎉 Insertion Complete!');
  console.log('━'.repeat(60));
  console.log(`\n✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`⏱️  Duration: ${duration}s`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors encountered:`);
    errors.slice(0, 10).forEach((err, idx) => {
      console.log(`   ${idx + 1}. ${err.product}: ${err.error}`);
    });
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more`);
    }
  }

  await printSummary();

  // Disconnect
  await prisma.$disconnect();

  console.log('\n✅ Database connection closed');
  console.log('━'.repeat(60) + '\n');
}

// =========================================
// Execute
// =========================================

main()
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    if (prisma) {
      prisma.$disconnect();
    }
    process.exit(1);
  });

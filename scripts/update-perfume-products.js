#!/usr/bin/env node

/**
 * Script to update PERFUME products in lista.json
 * - Sets category to "PERFUME" (only if category is empty)
 * - Extracts brand name from second word in product name
 */

const fs = require('fs');
const path = require('path');

// File paths
const JSON_FILE = path.join(__dirname, '../products/lista.json');
const BACKUP_FILE = path.join(__dirname, '../products/lista.backup-perfume.json');
const REPORT_FILE = path.join(__dirname, '../products/perfume-update-report.json');

console.log('🔍 Starting PERFUME products update...\n');

// Read the JSON file
let data;
try {
  const fileContent = fs.readFileSync(JSON_FILE, 'utf-8');
  data = JSON.parse(fileContent);
  console.log(`✅ Loaded ${data.length} products from lista.json\n`);
} catch (error) {
  console.error('❌ Error reading JSON file:', error.message);
  process.exit(1);
}

// Create backup
try {
  fs.copyFileSync(JSON_FILE, BACKUP_FILE);
  console.log(`✅ Backup created at: ${BACKUP_FILE}\n`);
} catch (error) {
  console.error('❌ Error creating backup:', error.message);
  process.exit(1);
}

// Extract brand name from product name
function extractBrandName(productName) {
  // Split by spaces
  const words = productName.trim().split(/\s+/);

  // First word should be "PERFUME"
  if (words.length < 2) {
    return '';
  }

  // Second word is the brand
  let brandName = words[1];

  // Handle special cases for multi-word brands
  if (brandName === 'ABERCROMBIE' && words[2] === '&' && words[3] === 'FITCH') {
    brandName = 'ABERCROMBIE & FITCH';
  } else if (brandName === 'AIR' && words[2] === 'VAL') {
    brandName = 'AIR VAL';
  } else if (brandName === 'AL' && words[2] === 'HARAMAIN') {
    brandName = 'AL HARAMAIN';
  } else if (brandName === 'AL' && words[2] === 'WATANIAH') {
    brandName = 'AL WATANIAH';
  } else if (brandName === 'PROVADOR') {
    // Special case: "PERFUME PROVADOR BRAND_NAME" - extract the actual brand
    if (words.length >= 3) {
      if (words[2] === 'AL' && words[3] === 'HARAMAIN') {
        brandName = 'AL HARAMAIN';
      } else if (words[2] === 'AL' && words[3] === 'WATANIAH') {
        brandName = 'AL WATANIAH';
      } else if (words[2] === 'ABERCROMBIE' && words[3] === '&' && words[4] === 'FITCH') {
        brandName = 'ABERCROMBIE & FITCH';
      } else {
        brandName = words[2]; // Use third word as brand for PROVADOR products
      }
    }
  } else if (brandName === 'JEAN' && words[2] === 'PAUL' && words[3] === 'GAULTIER') {
    brandName = 'JEAN PAUL GAULTIER';
  } else if (brandName === 'CAROLINA' && words[2] === 'HERRERA') {
    brandName = 'CAROLINA HERRERA';
  } else if (brandName === 'DOLCE' && words[2] === '&' && words[3] === 'GABBANA') {
    brandName = 'DOLCE & GABBANA';
  } else if (brandName === 'GIORGIO' && words[2] === 'ARMANI') {
    brandName = 'GIORGIO ARMANI';
  } else if (brandName === 'PACO' && words[2] === 'RABANNE') {
    brandName = 'PACO RABANNE';
  } else if (brandName === 'RALPH' && words[2] === 'LAUREN') {
    brandName = 'RALPH LAUREN';
  } else if (brandName === 'TOMMY' && words[2] === 'HILFIGER') {
    brandName = 'TOMMY HILFIGER';
  } else if (brandName === 'VICTOR' && words[2] === '&' && words[3] === 'ROLF') {
    brandName = 'VICTOR & ROLF';
  } else if (brandName === 'YVES' && words[2] === 'SAINT' && words[3] === 'LAURENT') {
    brandName = 'YVES SAINT LAURENT';
  }

  return brandName;
}

// Find and update PERFUME products
let updatedCount = 0;
let skippedCount = 0;
const updatedProducts = [];
const skippedProducts = [];
const brandStats = {};

data.forEach((product, index) => {
  if (product.name && product.name.trim().startsWith('PERFUME ')) {
    const brandName = extractBrandName(product.name);

    // Only update if category is empty
    if (!product.category || product.category.trim() === '') {
      // Update product
      const oldCategory = product.category;
      const oldBrand = product.brand_name;

      product.category = 'PERFUME';
      product.brand_name = brandName;

      updatedCount++;

      // Track brand statistics
      if (!brandStats[brandName]) {
        brandStats[brandName] = 0;
      }
      brandStats[brandName]++;

      // Store update info
      updatedProducts.push({
        id: product.id,
        name: product.name,
        oldCategory: oldCategory || '(empty)',
        newCategory: 'PERFUME',
        oldBrand: oldBrand || '(empty)',
        newBrand: brandName,
        referenceId: product.referenceId
      });
    } else {
      // Skip because category is not empty
      skippedCount++;
      skippedProducts.push({
        id: product.id,
        name: product.name,
        existingCategory: product.category,
        reason: 'Category already set'
      });
    }
  }
});

console.log(`📊 Update Statistics:\n`);
console.log(`   Total PERFUME products found: ${updatedCount + skippedCount}`);
console.log(`   Products updated: ${updatedCount}`);
console.log(`   Products skipped (category not empty): ${skippedCount}`);

if (updatedCount > 0) {
  console.log(`\n   Brands distribution:`);

  // Sort brands by count
  const sortedBrands = Object.entries(brandStats)
    .sort((a, b) => b[1] - a[1]);

  sortedBrands.forEach(([brand, count]) => {
    console.log(`   - ${brand.padEnd(30)}: ${count} products`);
  });
}

// Save updated JSON
try {
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ Updated JSON file saved: ${JSON_FILE}`);
} catch (error) {
  console.error('\n❌ Error saving JSON file:', error.message);
  console.log('⚠️  Restoring from backup...');
  fs.copyFileSync(BACKUP_FILE, JSON_FILE);
  process.exit(1);
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  totalPerfumeProducts: updatedCount + skippedCount,
  productsUpdated: updatedCount,
  productsSkipped: skippedCount,
  brandStatistics: brandStats,
  updatedProducts: updatedProducts,
  skippedProducts: skippedProducts
};

try {
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ Detailed report saved: ${REPORT_FILE}`);
} catch (error) {
  console.error('⚠️  Warning: Could not save report:', error.message);
}

console.log('\n🎉 Update completed successfully!');
console.log(`\n📝 Summary:`);
console.log(`   - Backup: ${BACKUP_FILE}`);
console.log(`   - Updated: ${JSON_FILE}`);
console.log(`   - Report: ${REPORT_FILE}`);
console.log(`\n   Total PERFUME products: ${updatedCount + skippedCount}`);
console.log(`   Updated: ${updatedCount}`);
console.log(`   Skipped: ${skippedCount}`);
if (updatedCount > 0) {
  console.log(`   Unique brands: ${Object.keys(brandStats).length}`);
}

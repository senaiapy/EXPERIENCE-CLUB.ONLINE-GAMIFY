#!/usr/bin/env node

/**
 * Script to update OCULOS products in lista.json
 * - Sets category to "OCULOS"
 * - Extracts brand name from second word in product name
 */

const fs = require('fs');
const path = require('path');

// File paths
const JSON_FILE = path.join(__dirname, '../products/lista.json');
const BACKUP_FILE = path.join(__dirname, '../products/lista.backup.json');
const REPORT_FILE = path.join(__dirname, '../products/oculos-update-report.json');

console.log('🔍 Starting OCULOS products update...\n');

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

  // First word should be "OCULOS"
  if (words.length < 2) {
    return '';
  }

  // Second word is the brand
  let brandName = words[1];

  // Handle special cases
  if (brandName === 'RAY' && words[2] === 'BAN') {
    brandName = 'RAY-BAN';
  } else if (brandName === 'RAY-BAN') {
    brandName = 'RAY-BAN';
  } else if (brandName === 'ARMANI' && words[2] === 'EXCHANGE') {
    brandName = 'ARMANI EXCHANGE';
  } else if (brandName === 'TOMMY' && words[2] === 'HILFIGER') {
    brandName = 'TOMMY HILFIGER';
  }

  return brandName;
}

// Find and update OCULOS products
let updatedCount = 0;
const updatedProducts = [];
const brandStats = {};

data.forEach((product, index) => {
  if (product.name && product.name.trim().startsWith('OCULOS ')) {
    const brandName = extractBrandName(product.name);

    // Update product
    const oldCategory = product.category;
    const oldBrand = product.brand_name;

    product.category = 'OCULOS';
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
      newCategory: 'OCULOS',
      oldBrand: oldBrand || '(empty)',
      newBrand: brandName,
      referenceId: product.referenceId
    });
  }
});

console.log(`📊 Update Statistics:\n`);
console.log(`   Total products updated: ${updatedCount}`);
console.log(`\n   Brands distribution:`);

// Sort brands by count
const sortedBrands = Object.entries(brandStats)
  .sort((a, b) => b[1] - a[1]);

sortedBrands.forEach(([brand, count]) => {
  console.log(`   - ${brand.padEnd(20)}: ${count} products`);
});

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
  totalProductsUpdated: updatedCount,
  brandStatistics: brandStats,
  updatedProducts: updatedProducts
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
console.log(`\n   Total OCULOS products: ${updatedCount}`);
console.log(`   Unique brands: ${Object.keys(brandStats).length}`);

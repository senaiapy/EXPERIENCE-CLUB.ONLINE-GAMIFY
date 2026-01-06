#!/usr/bin/env node

/**
 * Script to enrich lista.json with data from products.json by matching product names
 * - Matches products by name (case-insensitive, trimmed)
 * - Updates empty fields only: category, tags, description, specifications, details, images, brand_name
 */

const fs = require('fs');
const path = require('path');

// File paths
const LISTA_FILE = path.join(__dirname, '../products/lista.json');
const PRODUCTS_FILE = path.join(__dirname, '../products/products.json');
const BACKUP_FILE = path.join(__dirname, '../products/lista.backup-name-enrichment.json');
const REPORT_FILE = path.join(__dirname, '../products/name-enrichment-report.json');

console.log('🔍 Starting product enrichment by name matching...\n');

// Read lista.json
let listaData;
try {
  const fileContent = fs.readFileSync(LISTA_FILE, 'utf-8');
  listaData = JSON.parse(fileContent);
  console.log(`✅ Loaded ${listaData.length} products from lista.json`);
} catch (error) {
  console.error('❌ Error reading lista.json:', error.message);
  process.exit(1);
}

// Read products.json
let productsData;
try {
  const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  productsData = JSON.parse(fileContent);
  console.log(`✅ Loaded ${productsData.length} products from products.json\n`);
} catch (error) {
  console.error('❌ Error reading products.json:', error.message);
  process.exit(1);
}

// Create backup
try {
  fs.copyFileSync(LISTA_FILE, BACKUP_FILE);
  console.log(`✅ Backup created at: ${BACKUP_FILE}\n`);
} catch (error) {
  console.error('❌ Error creating backup:', error.message);
  process.exit(1);
}

// Normalize name for comparison
function normalizeName(name) {
  return name.trim().toLowerCase();
}

// Create index of products.json by normalized name for fast lookup
const productsIndex = {};
productsData.forEach(product => {
  if (product.name) {
    const normalizedName = normalizeName(product.name);
    // Store first match (in case of duplicates)
    if (!productsIndex[normalizedName]) {
      productsIndex[normalizedName] = product;
    }
  }
});

console.log(`📊 Indexed ${Object.keys(productsIndex).length} unique products by name\n`);

// Fields to enrich
const FIELDS_TO_ENRICH = [
  'category',
  'tags',
  'description',
  'specifications',
  'details',
  'images',
  'brand_name'
];

// Check if product has any empty fields
function hasEmptyFields(product) {
  return FIELDS_TO_ENRICH.some(field => {
    const value = product[field];
    return !value || value.trim() === '';
  });
}

// Enrichment statistics
let totalWithEmptyFields = 0;
let totalMatched = 0;
let totalEnriched = 0;
let totalNotMatched = 0;
const fieldStats = {};
const enrichedProducts = [];
const notMatchedProducts = [];

FIELDS_TO_ENRICH.forEach(field => {
  fieldStats[field] = 0;
});

// Process each product in lista.json
console.log('🔄 Processing products...\n');

listaData.forEach((listaProduct, index) => {
  // Show progress every 1000 products
  if ((index + 1) % 1000 === 0) {
    console.log(`   Processed ${index + 1} / ${listaData.length} products...`);
  }

  // Skip if product has no empty fields
  if (!hasEmptyFields(listaProduct)) {
    return;
  }

  totalWithEmptyFields++;

  const normalizedName = normalizeName(listaProduct.name || '');

  if (!normalizedName) {
    return; // Skip products without name
  }

  // Find matching product in products.json by name
  const sourceProduct = productsIndex[normalizedName];

  if (!sourceProduct) {
    totalNotMatched++;
    notMatchedProducts.push({
      id: listaProduct.id,
      name: listaProduct.name,
      referenceId: listaProduct.referenceId
    });
    return;
  }

  totalMatched++;
  let fieldsUpdated = 0;
  const updates = {};

  // Check and update each field if empty
  FIELDS_TO_ENRICH.forEach(field => {
    // Check if field is empty in lista.json
    const listaValue = listaProduct[field];
    const isEmpty = !listaValue || listaValue.trim() === '';

    if (isEmpty && sourceProduct[field]) {
      // Update the field
      listaProduct[field] = sourceProduct[field];
      fieldsUpdated++;
      fieldStats[field]++;
      updates[field] = {
        old: listaValue || '(empty)',
        new: sourceProduct[field].substring(0, 100) + (sourceProduct[field].length > 100 ? '...' : '')
      };
    }
  });

  if (fieldsUpdated > 0) {
    totalEnriched++;
    enrichedProducts.push({
      id: listaProduct.id,
      name: listaProduct.name,
      referenceId: listaProduct.referenceId,
      fieldsUpdated: fieldsUpdated,
      updates: updates
    });
  }
});

console.log('\n');

// Display statistics
console.log(`📊 Enrichment Statistics:\n`);
console.log(`   Total products in lista.json: ${listaData.length}`);
console.log(`   Products with empty fields: ${totalWithEmptyFields}`);
console.log(`   Products matched by name: ${totalMatched}`);
console.log(`   Products enriched (updated): ${totalEnriched}`);
console.log(`   Products not matched: ${totalNotMatched}`);

console.log(`\n   Fields updated:`);
FIELDS_TO_ENRICH.forEach(field => {
  if (fieldStats[field] > 0) {
    console.log(`   - ${field.padEnd(20)}: ${fieldStats[field]} products`);
  }
});

// Save updated lista.json
try {
  fs.writeFileSync(LISTA_FILE, JSON.stringify(listaData, null, 2), 'utf-8');
  console.log(`\n✅ Updated lista.json saved: ${LISTA_FILE}`);
} catch (error) {
  console.error('\n❌ Error saving lista.json:', error.message);
  console.log('⚠️  Restoring from backup...');
  fs.copyFileSync(BACKUP_FILE, LISTA_FILE);
  process.exit(1);
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  totalProducts: listaData.length,
  totalWithEmptyFields: totalWithEmptyFields,
  totalMatched: totalMatched,
  totalEnriched: totalEnriched,
  totalNotMatched: totalNotMatched,
  fieldStatistics: fieldStats,
  enrichedProducts: enrichedProducts.slice(0, 100), // Save first 100 for report
  notMatchedProducts: notMatchedProducts.slice(0, 100), // Save first 100 for report
  summary: {
    totalEnrichedProducts: enrichedProducts.length,
    totalNotMatchedProducts: notMatchedProducts.length
  }
};

try {
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ Detailed report saved: ${REPORT_FILE}`);
} catch (error) {
  console.error('⚠️  Warning: Could not save report:', error.message);
}

console.log('\n🎉 Name-based enrichment completed successfully!');
console.log(`\n📝 Summary:`);
console.log(`   - Backup: ${BACKUP_FILE}`);
console.log(`   - Updated: ${LISTA_FILE}`);
console.log(`   - Report: ${REPORT_FILE}`);

if (totalWithEmptyFields > 0) {
  console.log(`\n   Match rate (of products with empty fields): ${((totalMatched / totalWithEmptyFields) * 100).toFixed(2)}%`);
  console.log(`   Enrichment rate (of products with empty fields): ${((totalEnriched / totalWithEmptyFields) * 100).toFixed(2)}%`);
}
console.log(`   Overall enrichment rate: ${((totalEnriched / listaData.length) * 100).toFixed(2)}%`);

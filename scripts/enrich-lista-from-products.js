#!/usr/bin/env node

/**
 * Script to enrich lista.json with data from products.json
 * - Matches products by referenceId
 * - Updates empty fields only: category, tags, description, specifications, details, images, brand_name
 */

const fs = require('fs');
const path = require('path');

// File paths
const LISTA_FILE = path.join(__dirname, '../products/lista.json');
const PRODUCTS_FILE = path.join(__dirname, '../products/products.json');
const BACKUP_FILE = path.join(__dirname, '../products/lista.backup-enrichment.json');
const REPORT_FILE = path.join(__dirname, '../products/enrichment-report.json');

console.log('🔍 Starting product enrichment process...\n');

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

// Create index of products.json by referenceId for fast lookup
const productsIndex = {};
productsData.forEach(product => {
  if (product.referenceId) {
    productsIndex[product.referenceId] = product;
  }
});

console.log(`📊 Indexed ${Object.keys(productsIndex).length} products by referenceId\n`);

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

// Enrichment statistics
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
listaData.forEach((listaProduct, index) => {
  const referenceId = listaProduct.referenceId;

  if (!referenceId) {
    return; // Skip products without referenceId
  }

  // Find matching product in products.json
  const sourceProduct = productsIndex[referenceId];

  if (!sourceProduct) {
    totalNotMatched++;
    notMatchedProducts.push({
      id: listaProduct.id,
      name: listaProduct.name,
      referenceId: referenceId
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
        new: sourceProduct[field]
      };
    }
  });

  if (fieldsUpdated > 0) {
    totalEnriched++;
    enrichedProducts.push({
      id: listaProduct.id,
      name: listaProduct.name,
      referenceId: referenceId,
      fieldsUpdated: fieldsUpdated,
      updates: updates
    });
  }
});

// Display statistics
console.log(`📊 Enrichment Statistics:\n`);
console.log(`   Total products in lista.json: ${listaData.length}`);
console.log(`   Products matched by referenceId: ${totalMatched}`);
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

console.log('\n🎉 Enrichment completed successfully!');
console.log(`\n📝 Summary:`);
console.log(`   - Backup: ${BACKUP_FILE}`);
console.log(`   - Updated: ${LISTA_FILE}`);
console.log(`   - Report: ${REPORT_FILE}`);
console.log(`\n   Match rate: ${((totalMatched / listaData.length) * 100).toFixed(2)}%`);
console.log(`   Enrichment rate: ${((totalEnriched / listaData.length) * 100).toFixed(2)}%`);

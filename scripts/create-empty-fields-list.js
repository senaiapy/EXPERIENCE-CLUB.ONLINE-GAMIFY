#!/usr/bin/env node

/**
 * Script to create a list of products with empty fields from lista.json
 */

const fs = require('fs');
const path = require('path');

const LISTA_FILE = path.join(__dirname, '../products/lista.json');
const OUTPUT_FILE = path.join(__dirname, '../products/products_empty_fields.json');

console.log('🔍 Creating list of products with empty fields...\n');

// Read lista.json
let listaData;
try {
  const fileContent = fs.readFileSync(LISTA_FILE, 'utf-8');
  listaData = JSON.parse(fileContent);
  console.log(`✅ Loaded ${listaData.length} products from lista.json\n`);
} catch (error) {
  console.error('❌ Error reading lista.json:', error.message);
  process.exit(1);
}

// Fields to check
const FIELDS_TO_CHECK = [
  'category',
  'tags',
  'description',
  'specifications',
  'details',
  'images',
  'brand_name'
];

// Find products with empty fields
const productsWithEmptyFields = [];

listaData.forEach(product => {
  const emptyFields = [];

  FIELDS_TO_CHECK.forEach(field => {
    const value = product[field];
    if (!value || value.trim() === '') {
      emptyFields.push(field);
    }
  });

  if (emptyFields.length > 0) {
    productsWithEmptyFields.push({
      id: product.id,
      name: product.name,
      referenceId: product.referenceId,
      stockStatus: product.stockStatus,
      price: product.price,
      price_sale: product.price_sale,
      emptyFields: emptyFields,
      currentData: {
        category: product.category || '',
        tags: product.tags || '',
        description: product.description || '',
        specifications: product.specifications || '',
        details: product.details || '',
        images: product.images || '',
        brand_name: product.brand_name || ''
      }
    });
  }
});

// Save to file
try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(productsWithEmptyFields, null, 2), 'utf-8');
  console.log(`✅ Created list with ${productsWithEmptyFields.length} products`);
  console.log(`📄 File saved: ${OUTPUT_FILE}\n`);
} catch (error) {
  console.error('❌ Error saving file:', error.message);
  process.exit(1);
}

// Statistics
const fieldCounts = {};
FIELDS_TO_CHECK.forEach(field => fieldCounts[field] = 0);

productsWithEmptyFields.forEach(product => {
  product.emptyFields.forEach(field => {
    fieldCounts[field]++;
  });
});

console.log('📊 Empty fields statistics:');
Object.entries(fieldCounts).forEach(([field, count]) => {
  console.log(`   - ${field.padEnd(20)}: ${count} products`);
});

console.log('\n✅ Done!');

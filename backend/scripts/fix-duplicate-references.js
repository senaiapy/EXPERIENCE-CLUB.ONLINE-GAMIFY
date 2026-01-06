const fs = require('fs');
const path = require('path');

// Path to the products.json file
const productsJsonPath = path.join(__dirname, '..', 'db', 'products.json');
const backupPath = path.join(__dirname, '..', 'db', 'products_backup.json');

console.log('🔧 Starting duplicate referenceId fix...');

// Read the products.json file
let products;
try {
  const data = fs.readFileSync(productsJsonPath, 'utf8');
  products = JSON.parse(data);
  console.log(`📦 Loaded ${products.length} products from JSON file`);
} catch (error) {
  console.error('❌ Error reading products.json:', error);
  process.exit(1);
}

// Create backup
try {
  fs.writeFileSync(backupPath, JSON.stringify(products, null, 2));
  console.log('💾 Created backup at products_backup.json');
} catch (error) {
  console.error('❌ Error creating backup:', error);
  process.exit(1);
}

// Track used referenceIds and duplicates
const usedReferenceIds = new Set();
const duplicates = [];
let nextReferenceId = 12001; // Start from 12001 as requested

// First pass: identify duplicates
products.forEach((product, index) => {
  if (usedReferenceIds.has(product.referenceId)) {
    duplicates.push({ index, originalReferenceId: product.referenceId });
  } else {
    usedReferenceIds.add(product.referenceId);
  }
});

console.log(`🔍 Found ${duplicates.length} duplicate referenceIds`);

// Second pass: assign new referenceIds to duplicates
duplicates.forEach(({ index, originalReferenceId }) => {
  // Find a unique referenceId
  while (usedReferenceIds.has(nextReferenceId.toString())) {
    nextReferenceId++;
  }

  const newReferenceId = nextReferenceId.toString();
  products[index].referenceId = newReferenceId;
  usedReferenceIds.add(newReferenceId);

  console.log(`🔄 Updated duplicate referenceId ${originalReferenceId} to ${newReferenceId} for product: ${products[index].name.substring(0, 50)}...`);

  nextReferenceId++;
});

// Write the fixed products back to file
try {
  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2));
  console.log(`✅ Fixed ${duplicates.length} duplicate referenceIds`);
  console.log(`📁 Updated products.json with unique referenceIds`);
  console.log(`🔢 Next available referenceId starts from: ${nextReferenceId}`);
} catch (error) {
  console.error('❌ Error writing fixed products.json:', error);
  process.exit(1);
}

console.log('🎉 Duplicate referenceId fix completed successfully!');
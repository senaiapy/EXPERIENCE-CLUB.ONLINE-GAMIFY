const fs = require('fs');
const path = require('path');

// Path to the products.json file
const productsJsonPath = path.join(__dirname, '..', 'db', 'products.json');
const backupPath = path.join(__dirname, '..', 'db', 'products_images_backup.json');

console.log('🔧 Starting invalid image URLs fix...');

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
  console.log('💾 Created backup at products_images_backup.json');
} catch (error) {
  console.error('❌ Error creating backup:', error);
  process.exit(1);
}

// Track fixes
let fixedCount = 0;
const invalidImagePatterns = ['flag-py.png', 'flag-br.png', '', null, undefined];

// Fix invalid image URLs
products.forEach((product, index) => {
  const originalImage = product.images;

  // Check if image is invalid
  if (invalidImagePatterns.includes(originalImage) ||
      (typeof originalImage === 'string' && originalImage.trim() === '')) {

    // Try to generate a more appropriate image filename based on product info
    let newImageUrl = 'no-image.jpg'; // Default fallback

    // If we have a reference ID, try to use it for the image name
    if (product.referenceId) {
      newImageUrl = `${product.referenceId}.jpg`;
    } else if (product.id) {
      newImageUrl = `product-${product.id}.jpg`;
    }

    product.images = newImageUrl;
    fixedCount++;

    console.log(`🔄 Fixed invalid image for product ${product.referenceId || product.id}: "${originalImage}" → "${newImageUrl}"`);
  }
});

// Write the fixed products back to file
try {
  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2));
  console.log(`✅ Fixed ${fixedCount} invalid image URLs`);
  console.log(`📁 Updated products.json with valid image references`);
} catch (error) {
  console.error('❌ Error writing fixed products.json:', error);
  process.exit(1);
}

console.log('🎉 Invalid image URLs fix completed successfully!');
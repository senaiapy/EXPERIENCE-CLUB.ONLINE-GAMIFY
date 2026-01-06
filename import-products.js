const fs = require('fs');
const path = require('path');

// Read products JSON from frontend/db (complete database with 1076 products)
const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'frontend/db/products.json'), 'utf8')
);

console.log('-- Product Import SQL Script');
console.log('-- Total products to import:', productsData.length);
console.log('');

// First, create brands and categories
const brands = new Set();
const categories = new Set();

productsData.forEach(product => {
  if (product.brand_name) brands.add(product.brand_name);
  if (product.category) categories.add(product.category);
});

console.log('-- Create Brands');
let brandId = 1;
const brandMap = {};
brands.forEach(brand => {
  const slug = brand.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  brandMap[brand] = `brand-${brandId}`;
  console.log(`INSERT INTO "Brand" (id, name, slug, "createdAt", "updatedAt") VALUES ('brand-${brandId}', '${brand.replace(/'/g, "''")}', '${slug}', NOW(), NOW()) ON CONFLICT (slug) DO NOTHING;`);
  brandId++;
});

console.log('');
console.log('-- Create Categories');
let categoryId = 1;
const categoryMap = {};
categories.forEach(category => {
  const slug = category.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  categoryMap[category] = `category-${categoryId}`;
  console.log(`INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt") VALUES ('category-${categoryId}', '${category.replace(/'/g, "''")}', '${slug}', NOW(), NOW()) ON CONFLICT (slug) DO NOTHING;`);
  categoryId++;
});

console.log('');
console.log('-- Create Products');

// Process ALL products (1076 total)
for (let i = 0; i < productsData.length; i++) {
  const product = productsData[i];

  // Keep prices in Guaraníes (no conversion needed)
  const price = product.price ? parseInt(product.price) : 0;
  const salePrice = product.price_sale ? product.price_sale : null;

  // Determine stock quantity based on status
  const stockQuantity = product.stockStatus === 'En stock' ? 10 : 0;

  // Get brand and category IDs
  const brandId = brandMap[product.brand_name] || null;
  const categoryId = categoryMap[product.category] || null;

  // Create slug from name or specifications
  const slug = (product.specifications || product.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Escape single quotes
  const name = product.name.replace(/'/g, "''");
  const description = (product.description || product.name).replace(/'/g, "''");

  const productId = `product-${i + 1}`;

  console.log(`INSERT INTO "Product" (id, "referenceId", name, slug, description, price, price_sale, "stockQuantity", stock, "stockStatus", "brandId", "categoryId", brand_name, "createdAt", "updatedAt") VALUES ('${productId}', '${product.referenceId}', '${name}', '${slug}', '${description}', ${price}, ${salePrice ? `'${salePrice}'` : 'NULL'}, '${stockQuantity}', ${stockQuantity}, '${product.stockStatus}', ${brandId ? `'${brandId}'` : 'NULL'}, ${categoryId ? `'${categoryId}'` : 'NULL'}, '${product.brand_name ? product.brand_name.replace(/'/g, "''") : ''}', NOW(), NOW()) ON CONFLICT (slug) DO NOTHING;`);

  // Add product image if exists
  if (product.images) {
    const imageUrl = `/${product.images}`;
    const filename = product.images;
    console.log(`INSERT INTO "ProductImage" (id, "productId", url, size, filename, "createdAt") VALUES (gen_random_uuid()::text, '${productId}', '${imageUrl}', 'MEDIUM', '${filename}', NOW()) ON CONFLICT ("productId", size) DO NOTHING;`);
  }
}

console.log('');
console.log('-- Import complete! Imported', productsData.length, 'products');

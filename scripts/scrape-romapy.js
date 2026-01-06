#!/usr/bin/env node

/**
 * Script to scrape product details from romapy.com
 *
 * IMPORTANT NOTES:
 * - This script makes web requests and should be used responsibly
 * - Consider rate limiting to avoid overwhelming the server
 * - Respect robots.txt and terms of service
 * - Large-scale scraping (5,725 products) will take significant time
 *
 * Usage: node scrape-romapy.js [--limit 10] [--delay 2000]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const DELAY_BETWEEN_REQUESTS = process.argv.includes('--delay')
  ? parseInt(process.argv[process.argv.indexOf('--delay') + 1])
  : 2000; // 2 seconds default

const LIMIT = process.argv.includes('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1])
  : null; // Process all by default

const EMPTY_FIELDS_FILE = path.join(__dirname, '../products/products_empty_fields.json');
const OUTPUT_FILE = path.join(__dirname, '../products/products_scraped_data.json');
const PROGRESS_FILE = path.join(__dirname, '../products/scraping_progress.json');

console.log('🔍 Starting romapy.com scraping process...\n');
console.log(`⚙️  Configuration:`);
console.log(`   - Delay between requests: ${DELAY_BETWEEN_REQUESTS}ms`);
console.log(`   - Limit: ${LIMIT || 'No limit (all products)'}\n`);

// Read products with empty fields
let productsToScrape;
try {
  const fileContent = fs.readFileSync(EMPTY_FIELDS_FILE, 'utf-8');
  productsToScrape = JSON.parse(fileContent);

  if (LIMIT) {
    productsToScrape = productsToScrape.slice(0, LIMIT);
  }

  console.log(`✅ Loaded ${productsToScrape.length} products to scrape\n`);
} catch (error) {
  console.error('❌ Error reading products_empty_fields.json:', error.message);
  process.exit(1);
}

// Load progress if exists
let progress = { completed: 0, scraped: [], failed: [] };
try {
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    console.log(`📊 Resuming from previous run: ${progress.completed} products already processed\n`);
  }
} catch (error) {
  console.log('⚠️  Could not load progress file, starting fresh\n');
}

// Simple function to make HTTPS GET request
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Extract product details from HTML (basic extraction)
function extractProductDetails(html, productName) {
  const details = {
    found: false,
    category: '',
    tags: '',
    description: '',
    specifications: '',
    details: '',
    images: '',
    brand_name: ''
  };

  // Check if product was found
  if (html.includes('No se encontraron productos') || html.includes('no products found')) {
    return details;
  }

  details.found = true;

  // Try to extract category from breadcrumb
  const categoryMatch = html.match(/<nav[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)<\/nav>/is);
  if (categoryMatch) {
    const categoryLinks = categoryMatch[1].match(/>([^<]+)</g);
    if (categoryLinks && categoryLinks.length > 1) {
      details.category = categoryLinks[categoryLinks.length - 2].replace(/[><]/g, '').trim();
    }
  }

  // Try to extract description
  const descMatch = html.match(/<div[^>]*class="[^"]*product-description[^"]*"[^>]*>(.*?)<\/div>/is);
  if (descMatch) {
    details.description = descMatch[1].replace(/<[^>]+>/g, ' ').trim().substring(0, 500);
  }

  // Try to extract brand
  const brandMatch = html.match(/<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)</i) ||
                     html.match(/Marca[:\s]+([A-Za-z0-9\s]+)/i);
  if (brandMatch) {
    details.brand_name = brandMatch[1].trim();
  }

  // Try to extract image
  const imgMatch = html.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i);
  if (imgMatch) {
    details.images = imgMatch[1];
  }

  return details;
}

// Search for product on romapy.com
async function searchProduct(product) {
  try {
    // Clean product name for search
    const searchTerm = encodeURIComponent(
      product.name
        .replace(/\*/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50)
    );

    const searchUrl = `https://www.romapy.com/?s=${searchTerm}&post_type=product&type_aws=true`;

    console.log(`   Searching: ${product.name.substring(0, 60)}...`);
    console.log(`   URL: ${searchUrl}`);

    const html = await fetchPage(searchUrl);
    const details = extractProductDetails(html, product.name);

    if (details.found) {
      console.log(`   ✅ Found product data`);
      return { success: true, data: details };
    } else {
      console.log(`   ❌ Product not found`);
      return { success: false, reason: 'not_found' };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Save progress
function saveProgress() {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
  } catch (error) {
    console.error('⚠️  Could not save progress:', error.message);
  }
}

// Main scraping loop
async function scrapeProducts() {
  console.log('🚀 Starting scraping process...\n');

  for (let i = 0; i < productsToScrape.length; i++) {
    const product = productsToScrape[i];

    console.log(`\n[${i + 1}/${productsToScrape.length}] Product ID: ${product.id}`);

    const result = await searchProduct(product);

    if (result.success) {
      progress.scraped.push({
        id: product.id,
        name: product.name,
        referenceId: product.referenceId,
        emptyFields: product.emptyFields,
        scrapedData: result.data
      });
    } else {
      progress.failed.push({
        id: product.id,
        name: product.name,
        reason: result.reason
      });
    }

    progress.completed++;

    // Save progress every 10 products
    if (progress.completed % 10 === 0) {
      saveProgress();
      console.log(`\n💾 Progress saved (${progress.completed} products processed)`);
    }

    // Delay before next request
    if (i < productsToScrape.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  // Final save
  saveProgress();

  // Save scraped data
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(progress.scraped, null, 2), 'utf-8');
    console.log(`\n✅ Scraped data saved: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error saving scraped data:', error.message);
  }

  // Statistics
  console.log('\n📊 Scraping Statistics:');
  console.log(`   Total processed: ${progress.completed}`);
  console.log(`   Successfully scraped: ${progress.scraped.length}`);
  console.log(`   Failed: ${progress.failed.length}`);
  console.log(`\n✅ Scraping completed!`);
}

// Run the scraper
scrapeProducts().catch(error => {
  console.error('\n❌ Fatal error:', error);
  saveProgress();
  process.exit(1);
});

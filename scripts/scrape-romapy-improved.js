#!/usr/bin/env node

/**
 * Improved script to scrape product details from romapy.com
 *
 * This version:
 * 1. Searches for product
 * 2. Extracts first result URL
 * 3. Fetches product page
 * 4. Extracts detailed information
 *
 * IMPORTANT: Use responsibly with rate limiting
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const DELAY_BETWEEN_REQUESTS = process.argv.includes('--delay')
  ? parseInt(process.argv[process.argv.indexOf('--delay') + 1])
  : 3000; // 3 seconds default

const LIMIT = process.argv.includes('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1])
  : 50; // Default to 50 for safety

const EMPTY_FIELDS_FILE = path.join(__dirname, '../products/products_empty_fields.json');
const OUTPUT_FILE = path.join(__dirname, '../products/products_scraped_data_improved.json');
const PROGRESS_FILE = path.join(__dirname, '../products/scraping_progress_improved.json');

console.log('🔍 Improved romapy.com scraping process...\n');
console.log(`⚙️  Configuration:`);
console.log(`   - Delay between requests: ${DELAY_BETWEEN_REQUESTS}ms`);
console.log(`   - Limit: ${LIMIT} products\n`);

console.log('⚠️  IMPORTANT NOTES:');
console.log('   - This will make 2 requests per product (search + product page)');
console.log(`   - Total requests: ~${LIMIT * 2}`);
console.log(`   - Estimated time: ~${Math.ceil((LIMIT * 2 * DELAY_BETWEEN_REQUESTS) / 60000)} minutes`);
console.log('   - Please use responsibly and respect the website\n');

// Read products
let productsToScrape;
try {
  const fileContent = fs.readFileSync(EMPTY_FIELDS_FILE, 'utf-8');
  productsToScrape = JSON.parse(fileContent).slice(0, LIMIT);
  console.log(`✅ Loaded ${productsToScrape.length} products to scrape\n`);
} catch (error) {
  console.error('❌ Error reading products_empty_fields.json:', error.message);
  process.exit(1);
}

// Load progress
let progress = { completed: 0, scraped: [], failed: [] };
try {
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    console.log(`📊 Resuming: ${progress.completed} products already processed\n`);
    // Filter out already processed products
    const processedIds = new Set([...progress.scraped.map(p => p.id), ...progress.failed.map(p => p.id)]);
    productsToScrape = productsToScrape.filter(p => !processedIds.has(p.id));
    console.log(`📝 Remaining to process: ${productsToScrape.length}\n`);
  }
} catch (error) {
  console.log('⚠️  Starting fresh\n');
}

// Fetch page
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extract product URL from search results
function extractProductUrl(html, productName) {
  // Look for product links in search results
  const productLinkRegex = /<a\s+href="(https:\/\/www\.romapy\.com\/shop\/[^"]+)"/gi;
  const matches = [...html.matchAll(productLinkRegex)];

  if (matches.length > 0) {
    // Return first match
    return matches[0][1];
  }

  return null;
}

// Extract details from product page
function extractProductDetails(html) {
  const details = {
    category: '',
    tags: '',
    description: '',
    specifications: '',
    details: '',
    images: '',
    brand_name: ''
  };

  // Extract category from breadcrumb
  const breadcrumbMatch = html.match(/<nav[^>]*class="[^"]*woocommerce-breadcrumb[^"]*"[^>]*>(.*?)<\/nav>/is);
  if (breadcrumbMatch) {
    const links = breadcrumbMatch[1].match(/<a[^>]*>([^<]+)<\/a>/g);
    if (links && links.length > 0) {
      const lastLink = links[links.length - 1];
      const categoryMatch = lastLink.match(/>([^<]+)</);
      if (categoryMatch) {
        details.category = categoryMatch[1].trim();
      }
    }
  }

  // Extract description from product short description or description tab
  const shortDescMatch = html.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>(.*?)<\/div>/is);
  if (shortDescMatch) {
    details.description = shortDescMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000);
  }

  // Try to extract from description tab
  if (!details.description) {
    const descTabMatch = html.match(/<div[^>]*id="tab-description[^"]*"[^>]*>(.*?)<\/div>/is);
    if (descTabMatch) {
      details.description = descTabMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 1000);
    }
  }

  // Extract brand from meta tags or product attributes
  const brandMetaMatch = html.match(/<meta[^>]*property="product:brand"[^>]*content="([^"]+)"/i);
  if (brandMetaMatch) {
    details.brand_name = brandMetaMatch[1].trim();
  }

  // Try to extract brand from product attributes
  if (!details.brand_name) {
    const brandAttrMatch = html.match(/Marca[:\s]*<\/[^>]+>\s*<[^>]+>([^<]+)/i) ||
                          html.match(/Brand[:\s]*<\/[^>]+>\s*<[^>]+>([^<]+)/i);
    if (brandAttrMatch) {
      details.brand_name = brandAttrMatch[1].trim();
    }
  }

  // Extract main product image
  const imgMatch = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i) ||
                   html.match(/<img[^>]*data-large_image="([^"]+)"/i);
  if (imgMatch) {
    const imgUrl = imgMatch[1];
    // Extract just the filename
    const filename = imgUrl.split('/').pop();
    details.images = filename;
  }

  // Extract tags from product_tag taxonomy
  const tagsMatch = html.match(/rel="tag">([^<]+)<\/a>/gi);
  if (tagsMatch) {
    const tags = tagsMatch.map(tag => tag.match(/>([^<]+)</)[1]);
    details.tags = tags.join(', ');
  }

  return details;
}

// Search and scrape product
async function scrapeProduct(product) {
  try {
    // Step 1: Search for product
    const searchTerm = encodeURIComponent(
      product.name
        .replace(/\*/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50)
    );

    const searchUrl = `https://www.romapy.com/?s=${searchTerm}&post_type=product&type_aws=true`;

    console.log(`   1️⃣  Searching: ${product.name.substring(0, 50)}...`);

    const searchHtml = await fetchPage(searchUrl);
    const productUrl = extractProductUrl(searchHtml, product.name);

    if (!productUrl) {
      console.log(`   ❌ No product URL found in search results`);
      return { success: false, reason: 'not_found' };
    }

    console.log(`   2️⃣  Found URL: ${productUrl.substring(0, 60)}...`);

    // Wait before fetching product page
    await sleep(1000);

    // Step 2: Fetch product page
    const productHtml = await fetchPage(productUrl);
    const details = extractProductDetails(productHtml);

    // Check if we got any data
    const hasData = Object.values(details).some(v => v !== '');

    if (hasData) {
      console.log(`   ✅ Extracted data:`);
      if (details.category) console.log(`      - Category: ${details.category}`);
      if (details.brand_name) console.log(`      - Brand: ${details.brand_name}`);
      if (details.images) console.log(`      - Image: ${details.images.substring(0, 40)}...`);
      if (details.description) console.log(`      - Description: ${details.description.substring(0, 60)}...`);

      return { success: true, data: details, url: productUrl };
    } else {
      console.log(`   ⚠️  Found page but no data extracted`);
      return { success: false, reason: 'no_data', url: productUrl };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, reason: 'error', error: error.message };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveProgress() {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(progress.scraped, null, 2));
  } catch (error) {
    console.error('⚠️  Could not save progress:', error.message);
  }
}

// Main loop
async function scrapeProducts() {
  console.log('🚀 Starting scraping...\n');

  for (let i = 0; i < productsToScrape.length; i++) {
    const product = productsToScrape[i];

    console.log(`\n[${progress.completed + 1}] Product ID: ${product.id} (${i + 1}/${productsToScrape.length})`);

    const result = await scrapeProduct(product);

    if (result.success) {
      progress.scraped.push({
        id: product.id,
        name: product.name,
        referenceId: product.referenceId,
        emptyFields: product.emptyFields,
        scrapedData: result.data,
        sourceUrl: result.url
      });
    } else {
      progress.failed.push({
        id: product.id,
        name: product.name,
        reason: result.reason,
        url: result.url || null
      });
    }

    progress.completed++;

    // Save every 5 products
    if (progress.completed % 5 === 0) {
      saveProgress();
      console.log(`\n💾 Progress saved (${progress.completed} total, ${progress.scraped.length} successful)`);
    }

    // Delay before next
    if (i < productsToScrape.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  saveProgress();

  console.log('\n📊 Final Statistics:');
  console.log(`   Total processed: ${progress.completed}`);
  console.log(`   Successfully scraped: ${progress.scraped.length}`);
  console.log(`   Failed: ${progress.failed.length}`);
  console.log(`\n✅ Done! Data saved to: ${OUTPUT_FILE}`);
}

scrapeProducts().catch(error => {
  console.error('\n❌ Fatal error:', error);
  saveProgress();
  process.exit(1);
});

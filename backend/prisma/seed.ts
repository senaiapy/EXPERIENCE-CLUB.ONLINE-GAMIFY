import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { seedGameData } from './seed-game';

// Interface for products from JSON file
interface ProductFromJSON {
  id: string;
  category: string;
  name: string;
  stockStatus: string;
  referenceId: string;
  tags: string;
  brand_name: string;
  description: string;
  specifications: string;
  details: string;
  price: string;
  price_sale: string;
  images: string;
}

const prisma = new PrismaClient();

// Perfume brands and their information
const BRANDS = [
  {
    name: 'Chanel',
    slug: 'chanel',
    description: 'Luxury French perfume house founded by Coco Chanel',
  },
  {
    name: 'Dior',
    slug: 'dior',
    description:
      'French luxury fashion house known for haute couture and fragrances',
  },
  {
    name: 'Calvin Klein',
    slug: 'calvin-klein',
    description:
      'American fashion brand known for modern and minimalist designs',
  },
  {
    name: 'Hugo Boss',
    slug: 'hugo-boss',
    description: 'German luxury fashion and style house',
  },
  {
    name: 'Versace',
    slug: 'versace',
    description: 'Italian luxury fashion company and trade name',
  },
  {
    name: 'Armani',
    slug: 'armani',
    description: 'Italian luxury fashion house founded by Giorgio Armani',
  },
  {
    name: 'Dolce & Gabbana',
    slug: 'dolce-gabbana',
    description: 'Italian luxury fashion house',
  },
  {
    name: 'Burberry',
    slug: 'burberry',
    description: 'British luxury fashion house',
  },
  {
    name: 'Azzaro',
    slug: 'azzaro',
    description: 'French fashion house known for elegant fragrances',
  },
  {
    name: 'Bvlgari',
    slug: 'bvlgari',
    description:
      'Italian luxury brand known for jewelry, watches, and fragrances',
  },
  {
    name: 'Carolina Herrera',
    slug: 'carolina-herrera',
    description: 'Venezuelan-American fashion designer',
  },
  {
    name: 'Antonio Banderas',
    slug: 'antonio-banderas',
    description: 'Spanish actor and fragrance creator',
  },
  {
    name: 'Britney Spears',
    slug: 'britney-spears',
    description: 'American singer and fragrance creator',
  },
  {
    name: 'Cabotine',
    slug: 'cabotine',
    description: 'French perfume brand known for floral fragrances',
  },
  {
    name: 'Abercrombie & Fitch',
    slug: 'abercrombie-fitch',
    description: 'American retailer focused on casual wear for young adults',
  },
  {
    name: 'Belkin',
    slug: 'belkin',
    description: 'Technology accessories and peripherals manufacturer',
  },
];

// Categories and their information
const CATEGORIES = [
  {
    name: 'Perfumes Masculinos',
    slug: 'perfumes-masculinos',
    description: 'Masculine fragrances and colognes',
  },
  {
    name: 'Perfumes Femeninos',
    slug: 'perfumes-femeninos',
    description: 'Feminine perfumes and fragrances',
  },
  {
    name: 'Perfumes Árabes Masculinos',
    slug: 'perfumes-arabes-masculinos',
    description: 'Arabian masculine fragrances',
  },
  {
    name: 'Perfumes Árabes Femeninos',
    slug: 'perfumes-arabes-femeninos',
    description: 'Arabian feminine fragrances',
  },
  {
    name: 'Perfumes Masculinos Diseñador',
    slug: 'perfumes-masculinos-disenador',
    description: 'Designer masculine fragrances',
  },
  {
    name: 'Apple',
    slug: 'apple',
    description: 'Apple products and accessories',
  },
  {
    name: 'Eletrônicos',
    slug: 'eletronicos',
    description: 'Electronic devices and gadgets',
  },
  {
    name: 'Informática',
    slug: 'informatica',
    description: 'Computer and IT products',
  },
  {
    name: 'Casa',
    slug: 'casa',
    description: 'Home and household products',
  },
  {
    name: 'Cozinha',
    slug: 'cozinha',
    description: 'Kitchen appliances and accessories',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function getRandomStock(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function loadProductsFromJSON(): ProductFromJSON[] {
  try {
    const jsonPath = path.join(__dirname, '..', 'db', 'products.json');
    console.log(`📂 Loading products from: ${jsonPath}`);

    const data = fs.readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(data);

    console.log(`📦 Loaded ${products.length} products from JSON file`);
    return products;
  } catch (error) {
    console.error('❌ Error loading products from JSON:', error);
    return [];
  }
}

// Price parsing function - keep in USD for database storage
function parsePrice(priceStr: string): number {
  if (!priceStr || priceStr.trim() === '') {
    return 100; // Default price of $100 USD
  }

  // Remove any non-numeric characters except dots and commas
  const cleanPrice = priceStr.replace(/[^\d.,]/g, '');

  // Convert to number (prices in JSON are in USD, keep as USD)
  const usdPrice = parseFloat(cleanPrice.replace(',', '.'));

  // Round to 2 decimal places for USD currency
  const roundedPrice = Math.round(usdPrice * 100) / 100;

  return roundedPrice > 0 ? roundedPrice : 100; // Default to $100 USD if parsing fails
}

function isProductAvailable(status: string): boolean {
  const lowerStatus = status.toLowerCase();
  return lowerStatus.includes('stock') || lowerStatus.includes('disponible');
}

async function seedUsers() {
  console.log('🔐 Seeding users...');

  // Create admin user if it doesn't exist
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@experienceclub.com' },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: 'admin@experienceclub.com',
        name: 'Administrator',
        password:
          '$2b$10$kOpQSOIZCfd7zY00UoA/xu3Uf4Bxm1XVRpkQV6X7lTsSem4/5pNTi', // admin123456
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('✅ Admin user already exists');
  }
}

async function seedBrands() {
  console.log('🏷️  Seeding brands...');

  for (const brandData of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brandData.slug },
      update: {},
      create: {
        name: brandData.name,
        slug: brandData.slug,
        description: brandData.description,
      },
    });
  }

  console.log(`✅ ${BRANDS.length} brands created/updated`);
}

async function seedCategories() {
  console.log('📂 Seeding categories...');

  for (const categoryData of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
      },
    });
  }

  console.log(`✅ ${CATEGORIES.length} categories created/updated`);
}

async function seedProductsFromJSON() {
  console.log('🧴 Seeding products from JSON file...');

  const jsonProducts = loadProductsFromJSON();
  if (jsonProducts.length === 0) {
    console.log('❌ No products found in JSON file');
    return;
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  console.log(`📦 Processing ${jsonProducts.length} products from JSON...`);

  let productCount = 0;
  const createdBrands = new Set<string>();
  const createdCategories = new Set<string>();

  for (const jsonProduct of jsonProducts) {
    try {
      // Handle empty or missing brand names
      let brandName = jsonProduct.brand_name?.trim() || 'Unknown Brand';

      // Try to extract brand from product name if brand_name is empty
      if (jsonProduct.brand_name?.trim() === '' || !jsonProduct.brand_name) {
        const productName = jsonProduct.name.toLowerCase();
        // Look for known brand patterns in product name
        const knownBrands = ['chanel', 'dior', 'calvin klein', 'hugo boss', 'versace', 'armani', 'dolce', 'gabbana', 'burberry', 'azzaro', 'bvlgari', 'carolina herrera', 'antonio banderas', 'britney spears', 'cabotine', 'abercrombie', 'fitch', 'belkin', 'apple', 'hasbro', 'victoria', 'sheglam', 'absolut'];

        const foundBrand = knownBrands.find(brand => productName.includes(brand));
        if (foundBrand) {
          brandName = foundBrand.charAt(0).toUpperCase() + foundBrand.slice(1);
        }
      }

      // Find or create brand
      let brand = brands.find(
        (b) => b.name.toLowerCase() === brandName.toLowerCase(),
      );
      if (!brand) {
        const brandSlug = slugify(brandName);
        brand = await prisma.brand.upsert({
          where: { slug: brandSlug },
          update: {},
          create: {
            name: brandName,
            slug: brandSlug,
            description: `Products from ${brandName}`,
          },
        });
        brands.push(brand);
        createdBrands.add(brandName);
      }

      // Find or create category
      let category = categories.find(
        (c) => c.name.toLowerCase() === jsonProduct.category.toLowerCase(),
      );
      if (!category) {
        const categorySlug = slugify(jsonProduct.category);
        category = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: {},
          create: {
            name: jsonProduct.category,
            slug: categorySlug,
            description: `Products in ${jsonProduct.category} category`,
          },
        });
        categories.push(category);
        createdCategories.add(jsonProduct.category);
      }

      // Generate product slug
      const productSlug = slugify(
        `${jsonProduct.brand_name}-${jsonProduct.name}-${jsonProduct.referenceId}`,
      );

      // Check if product already exists by referenceId
      const existingProduct = await prisma.product.findFirst({
        where: { referenceId: jsonProduct.referenceId },
      });

      if (existingProduct) {
        console.log(`⚠️  Product already exists with referenceId: ${jsonProduct.referenceId}`);
        continue;
      }

      // Parse price with proper precision
      const originalPrice = parsePrice(jsonProduct.price);
      const salePrice = parsePrice(jsonProduct.price_sale);

      // Determine which price is higher (should be displayed)
      const maxPrice = Math.max(originalPrice, salePrice);
      const minPrice = Math.min(originalPrice, salePrice);

      // Parse stock status
      const isAvailable = isProductAvailable(jsonProduct.stockStatus);
      const stockQuantity = isAvailable ? getRandomStock() : 0;

      // Create product with all required fields
      const product = await prisma.product.create({
        data: {
          name: jsonProduct.name,
          slug: productSlug,
          description: jsonProduct.description || 'No description available',
          specifications: jsonProduct.specifications || '',
          details: jsonProduct.details || '',
          price: maxPrice, // Store the HIGHER price as main price (to display)
          price_sale: maxPrice !== minPrice ? minPrice.toString() : null, // Store LOWER price as sale price (strikethrough)
          stock: stockQuantity,
          stockStatus: jsonProduct.stockStatus,
          stockQuantity: stockQuantity.toString(),
          referenceId: jsonProduct.referenceId || null,
          image_name: jsonProduct.images || null,
          brand_name: brandName, // Add the brand_name field
          tags: jsonProduct.tags
            ? jsonProduct.tags.split(',').map((tag) => tag.trim())
            : [],
          brandId: brand.id,
          categoryId: category.id,
        },
      });

      // Create product image if available
      if (jsonProduct.images && jsonProduct.images.trim() !== '') {
        const imageFilename = jsonProduct.images.trim();
        await prisma.productImage.create({
          data: {
            productId: product.id,
            filename: imageFilename,
            size: 'MEDIUM',
            url: `/images/${imageFilename}`,
          },
        });
      }

      productCount++;

      // Progress indicator
      if (productCount % 100 === 0) {
        console.log(`📦 Processed ${productCount}/${jsonProducts.length} products...`);
      }
    } catch (error) {
      console.error(`❌ Error creating product ${jsonProduct.name}:`, error);
      // Continue with next product instead of stopping
      continue;
    }
  }

  console.log(`✅ Created ${productCount} products`);
  console.log(`🏷️  Created ${createdBrands.size} new brands`);
  console.log(`📂 Created ${createdCategories.size} new categories`);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean existing data (in correct order to respect foreign keys)
    console.log('🧹 Cleaning existing data...');

    // Delete in order: OrderItems -> Orders -> CartItems -> Carts -> Wishlist -> ProductImages -> Products -> Brands/Categories
    console.log('  - Deleting order items...');
    await prisma.orderItem.deleteMany();

    console.log('  - Deleting orders...');
    await prisma.order.deleteMany();

    console.log('  - Deleting cart items...');
    await prisma.cartItem.deleteMany();

    console.log('  - Deleting carts...');
    await prisma.cart.deleteMany();

    console.log('  - Deleting wishlist items...');
    await prisma.wishlist.deleteMany();

    console.log('  - Deleting product images...');
    await prisma.productImage.deleteMany();

    console.log('  - Deleting products...');
    await prisma.product.deleteMany();

    console.log('  - Deleting brands...');
    await prisma.brand.deleteMany();

    console.log('  - Deleting categories...');
    await prisma.category.deleteMany();

    // Seed data
    await seedUsers();
    await seedBrands();
    await seedCategories();
    await seedProductsFromJSON();
    await seedGameData(prisma);

    console.log('🎉 Database seeding completed successfully!');

    // Display summary
    const userCount = await prisma.user.count();
    const brandCount = await prisma.brand.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const imageCount = await prisma.productImage.count();
    const taskCount = await prisma.gameTask.count();

    console.log('\n📊 Final Summary:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏷️ Brands: ${brandCount}`);
    console.log(`📂 Categories: ${categoryCount}`);
    console.log(`🧴 Products: ${productCount}`);
    console.log(`📷 Product Images: ${imageCount}`);
    console.log(`🎮 Game Tasks: ${taskCount}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
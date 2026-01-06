import { PrismaClient, ImageSize, UserRole } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Sample brand names extracted from the original PHP structure
const SAMPLE_BRANDS = [
  'Abercrombie & Fitch',
  'Antonio Banderas',
  'Azzaro',
  'Britney Spears',
  'Burberry',
  'Bulgari',
  'Cabotine',
  'Calvin Klein',
  'Carolina Herrera',
  'Chanel',
  'Dior',
  'Dolce & Gabbana',
  'Hermès',
  'Hugo Boss',
  'Importación',
  'Issey Miyake',
  'Jean Paul Gaultier',
  'Moschino',
  'Paco Rabanne',
];

const SAMPLE_CATEGORIES = [
  'Perfumes for Women',
  'Perfumes for Men',
  'Unisex Fragrances',
  'Body Care',
  'Gift Sets',
];

interface ImageGroup {
  baseHash: string;
  images: {
    size: ImageSize;
    filename: string;
    fullPath: string;
  }[];
}

async function createDefaultAdmin() {
  console.log('Creating default admin user...');
  
  const adminEmail = 'admin@experienceclub.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash('admin123456', 12);
  
  return prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
}

async function createBrandsAndCategories() {
  console.log('Creating brands and categories...');
  
  // Create brands
  const brands: any[] = [];
  for (const brandName of SAMPLE_BRANDS) {
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existingBrand = await prisma.brand.findUnique({
      where: { slug },
    });

    if (!existingBrand) {
      const brand = await prisma.brand.create({
        data: {
          name: brandName,
          slug,
          description: `Premium ${brandName} products`,
        },
      });
      brands.push(brand);
    } else {
      brands.push(existingBrand);
    }
  }

  // Create categories
  const categories: any[] = [];
  for (const categoryName of SAMPLE_CATEGORIES) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (!existingCategory) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          slug,
          description: `${categoryName} collection`,
        },
      });
      categories.push(category);
    } else {
      categories.push(existingCategory);
    }
  }

  return { brands, categories };
}

function groupImagesByHash(imagesDir: string): ImageGroup[] {
  const files = fs.readdirSync(imagesDir);
  const imageGroups = new Map<string, ImageGroup>();
  
  for (const filename of files) {
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) continue;
    
    // Parse the filename pattern: {size}_{hash}.{extension}
    const match = filename.match(/^(home|large|medium|small)_([a-f0-9]+)\./i);
    if (!match) continue;
    
    const [, sizeStr, hash] = match;
    const size = sizeStr.toUpperCase() as ImageSize;
    
    if (!imageGroups.has(hash)) {
      imageGroups.set(hash, {
        baseHash: hash,
        images: [],
      });
    }
    
    imageGroups.get(hash)!.images.push({
      size,
      filename,
      fullPath: path.join(imagesDir, filename),
    });
  }
  
  return Array.from(imageGroups.values());
}

async function copyImageToUploads(sourcePath: string, filename: string): Promise<void> {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  const destPath = path.join(uploadDir, filename);
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(sourcePath, destPath);
}

async function createProductsWithImages(
  imageGroups: ImageGroup[],
  brands: any[],
  categories: any[]
) {
  console.log(`Creating products for ${imageGroups.length} image groups...`);
  
  let createdCount = 0;
  
  for (const group of imageGroups) {
    // Generate product data
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const productName = `Premium ${randomBrand.name} ${randomCategory.name.split(' ')[0]} ${group.baseHash.substring(0, 8)}`;
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      console.log(`Product ${slug} already exists, skipping...`);
      continue;
    }

    try {
      // Create product
      const product = await prisma.product.create({
        data: {
          name: productName,
          slug,
          description: `Exclusive ${productName} with premium quality and exceptional fragrance.`,
          price: Math.floor(Math.random() * 200000) + 50000, // 50k to 250k
          stock: Math.floor(Math.random() * 100) + 1,
          stockStatus: 'AVAILABLE',
          stockQuantity: Math.floor(Math.random() * 100) + 1,
          brandId: randomBrand.id,
          categoryId: randomCategory.id,
        },
      });

      // Copy images and create database records
      for (const imageInfo of group.images) {
        const newFilename = `${group.baseHash}_${imageInfo.size.toLowerCase()}${path.extname(imageInfo.filename)}`;
        
        // Copy image to uploads directory
        await copyImageToUploads(imageInfo.fullPath, newFilename);
        
        // Create database record
        await prisma.productImage.create({
          data: {
            filename: newFilename,
            size: imageInfo.size,
            url: `/uploads/${newFilename}`,
            productId: product.id,
          },
        });
      }

      createdCount++;
      console.log(`Created product: ${productName} with ${group.images.length} images`);
      
      // Add a small delay to avoid overwhelming the system
      if (createdCount % 10 === 0) {
        console.log(`Progress: ${createdCount} products created...`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`Error creating product for hash ${group.baseHash}:`, error);
    }
  }
  
  return createdCount;
}

async function main() {
  try {
    console.log('Starting image migration...');
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Create brands and categories
    const { brands, categories } = await createBrandsAndCategories();
    
    // Get image groups from PHP directory
    const imagesDir = path.join(__dirname, '..', '..', '..', 'php', 'images', 'products');
    const imageGroups = groupImagesByHash(imagesDir);
    
    console.log(`Found ${imageGroups.length} unique product image groups`);
    
    // Create products with images (limit to first 50 for initial migration)
    const limitedGroups = imageGroups.slice(0, 50);
    const createdCount = await createProductsWithImages(limitedGroups, brands, categories);
    
    console.log(`Migration completed successfully!`);
    console.log(`- Created ${brands.length} brands`);
    console.log(`- Created ${categories.length} categories`);
    console.log(`- Created ${createdCount} products with images`);
    console.log(`- Admin user: admin@experienceclub.com / admin123456`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { main };
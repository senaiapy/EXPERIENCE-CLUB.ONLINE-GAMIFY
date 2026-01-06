import { PrismaClient, UserRole, ImageSize, ImageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Create Admin User
    console.log('🔐 Creating admin user...');
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@experienceclub.com' },
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: 'admin@experienceclub.com',
          name: 'Administrator',
          password: '$2b$10$kOpQSOIZCfd7zY00UoA/xu3Uf4Bxm1XVRpkQV6X7lTsSem4/5pNTi', // admin123456
          role: UserRole.ADMIN,
        },
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // 2. Create Brands
    console.log('🏷️ Creating brands...');
    const brands = [
      { name: 'Chanel', slug: 'chanel', description: 'Luxury French perfume house' },
      { name: 'Dior', slug: 'dior', description: 'French luxury fashion house' },
      { name: 'Calvin Klein', slug: 'calvin-klein', description: 'American fashion brand' },
      { name: 'Hugo Boss', slug: 'hugo-boss', description: 'German luxury fashion house' },
      { name: 'Versace', slug: 'versace', description: 'Italian luxury fashion company' },
      { name: 'Paco Rabanne', slug: 'paco-rabanne', description: 'Spanish fashion and fragrance company' },
    ];

    for (const brandData of brands) {
      const existing = await prisma.brand.findUnique({
        where: { slug: brandData.slug },
      });

      if (!existing) {
        await prisma.brand.create({
          data: brandData,
        });
        console.log(`  ✅ Created brand: ${brandData.name}`);
      }
    }

    // 3. Create Categories
    console.log('📂 Creating categories...');
    const categories = [
      { name: 'Perfumes Masculinos', slug: 'perfumes-masculinos', description: 'Fragrances for men' },
      { name: 'Perfumes Femeninos', slug: 'perfumes-femeninos', description: 'Fragrances for women' },
      { name: 'Perfumes Unisex', slug: 'perfumes-unisex', description: 'Unisex fragrances' },
      { name: 'Colonia', slug: 'colonia', description: 'Light fragrances and colognes' },
      { name: 'Perfumes Árabes', slug: 'perfumes-arabes', description: 'Middle Eastern fragrances' },
    ];

    for (const categoryData of categories) {
      const existing = await prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (!existing) {
        await prisma.category.create({
          data: categoryData,
        });
        console.log(`  ✅ Created category: ${categoryData.name}`);
      }
    }

    // 4. Get created brands and categories for products
    const createdBrands = await prisma.brand.findMany();
    const createdCategories = await prisma.category.findMany();

    // 5. Create Products
    console.log('🛍️ Creating products...');
    const products = [
      {
        name: 'Chanel No. 5',
        slug: 'chanel-no-5',
        description: 'The world\'s most famous perfume',
        specifications: '100ml Eau de Parfum',
        details: 'Iconic feminine fragrance with notes of aldehydes, ylang-ylang, and sandalwood',
        price: 120.00,
        price_sale: 99.99,
        stock: 25,
        stockQuantity: 25,
        stockStatus: 'En stock',
        referenceId: 'CHN001',
        tags: ['feminine', 'classic', 'luxury'],
        brandName: 'Chanel',
        categoryName: 'Perfumes Femeninos',
      },
      {
        name: 'Dior Sauvage',
        slug: 'dior-sauvage',
        description: 'A radically fresh composition',
        specifications: '100ml Eau de Toilette',
        details: 'Powerful and noble fragrance with bergamot and ambroxan',
        price: 95.00,
        price_sale: 85.00,
        stock: 30,
        stockQuantity: 30,
        stockStatus: 'En stock',
        referenceId: 'DIO001',
        tags: ['masculine', 'fresh', 'modern'],
        brandName: 'Dior',
        categoryName: 'Perfumes Masculinos',
      },
      {
        name: 'Calvin Klein Eternity',
        slug: 'ck-eternity',
        description: 'A timeless romantic fragrance',
        specifications: '100ml Eau de Parfum',
        details: 'Classic fragrance with white lily, marigold, and sandalwood',
        price: 75.00,
        price_sale: 65.00,
        stock: 0,
        stockQuantity: 0,
        stockStatus: 'Agotado',
        referenceId: 'CK001',
        tags: ['unisex', 'romantic', 'timeless'],
        brandName: 'Calvin Klein',
        categoryName: 'Perfumes Unisex',
      },
      {
        name: 'Hugo Boss Bottled',
        slug: 'hugo-boss-bottled',
        description: 'A fresh and sharp fragrance',
        specifications: '100ml Eau de Toilette',
        details: 'Masculine scent with apple, cinnamon, and sandalwood',
        price: 80.00,
        price_sale: null,
        stock: 15,
        stockQuantity: 15,
        stockStatus: 'En stock',
        referenceId: 'HB001',
        tags: ['masculine', 'fresh', 'elegant'],
        brandName: 'Hugo Boss',
        categoryName: 'Perfumes Masculinos',
      },
      {
        name: 'Versace Bright Crystal',
        slug: 'versace-bright-crystal',
        description: 'A precious jewel of rare beauty',
        specifications: '90ml Eau de Toilette',
        details: 'Luminous fragrance with pomegranate, peony, and musk',
        price: 85.00,
        price_sale: 75.00,
        stock: 20,
        stockQuantity: 20,
        stockStatus: 'En stock',
        referenceId: 'VER001',
        tags: ['feminine', 'floral', 'elegant'],
        brandName: 'Versace',
        categoryName: 'Perfumes Femeninos',
      },
      {
        name: 'Paco Rabanne 1 Million',
        slug: 'paco-rabanne-1-million',
        description: 'The fragrance of excess',
        specifications: '100ml Eau de Toilette',
        details: 'Powerful scent with grapefruit, cinnamon, and leather',
        price: 90.00,
        price_sale: 80.00,
        stock: 18,
        stockQuantity: 18,
        stockStatus: 'En stock',
        referenceId: 'PR001',
        tags: ['masculine', 'bold', 'luxury'],
        brandName: 'Paco Rabanne',
        categoryName: 'Perfumes Masculinos',
      },
    ];

    for (const productData of products) {
      const existing = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (!existing) {
        // Find brand and category
        const brand = createdBrands.find(b => b.name === productData.brandName);
        const category = createdCategories.find(c => c.name === productData.categoryName);

        await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            price: productData.price,
            stock: productData.stock,
            brandId: brand?.id,
            categoryId: category?.id,
          },
        });
        console.log(`  ✅ Created product: ${productData.name}`);
      }
    }

    // 6. Create some sample images
    console.log('🖼️ Creating sample images...');
    const sampleImages = [
      {
        name: 'Chanel No. 5 Product Image',
        description: 'Main product image for Chanel No. 5',
        originalName: 'chanel-no5.jpg',
        filename: 'chanel-no5-main.jpg',
        path: '/uploads/products/chanel-no5-main.jpg',
        url: '/images/products/chanel-no5-main.jpg',
        mimeType: 'image/jpeg',
        size: 150000,
        type: ImageType.PRODUCT,
        imageSize: ImageSize.MEDIUM,
        width: 500,
        height: 500,
        alt: 'Chanel No. 5 Perfume Bottle',
        tags: ['product', 'chanel', 'perfume'],
      },
      {
        name: 'Dior Sauvage Product Image',
        description: 'Main product image for Dior Sauvage',
        originalName: 'dior-sauvage.jpg',
        filename: 'dior-sauvage-main.jpg',
        path: '/uploads/products/dior-sauvage-main.jpg',
        url: '/images/products/dior-sauvage-main.jpg',
        mimeType: 'image/jpeg',
        size: 180000,
        type: ImageType.PRODUCT,
        imageSize: ImageSize.MEDIUM,
        width: 500,
        height: 500,
        alt: 'Dior Sauvage Perfume Bottle',
        tags: ['product', 'dior', 'perfume'],
      },
    ];

    for (const imageData of sampleImages) {
      const existing = await prisma.image.findUnique({
        where: { filename: imageData.filename },
      });

      if (!existing) {
        await prisma.image.create({
          data: imageData,
        });
        console.log(`  ✅ Created image: ${imageData.name}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');

    const userCount = await prisma.user.count();
    const brandCount = await prisma.brand.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const imageCount = await prisma.image.count();

    console.log(`  👥 Users: ${userCount}`);
    console.log(`  🏷️ Brands: ${brandCount}`);
    console.log(`  📂 Categories: ${categoryCount}`);
    console.log(`  🛍️ Products: ${productCount}`);
    console.log(`  🖼️ Images: ${imageCount}`);
    console.log('');
    console.log('🔑 Admin login credentials:');
    console.log('  Email: admin@experienceclub.com');
    console.log('  Password: admin123456');

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
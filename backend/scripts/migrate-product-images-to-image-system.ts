import { PrismaClient, ImageType, ImageSize } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function migrateProductImagesToImageSystem() {
  console.log('🔄 Starting migration from ProductImage to Image system...');
  
  try {
    // Get all ProductImage records
    const productImages = await prisma.productImage.findMany({
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      }
    });

    console.log(`📷 Found ${productImages.length} ProductImage records to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const productImage of productImages) {
      try {
        // Check if image already exists in Image table by filename
        const existingImage = await prisma.image.findUnique({
          where: { filename: productImage.filename }
        });

        if (existingImage) {
          // Create relation if it doesn't exist
          const existingRelation = await prisma.productImageRelation.findUnique({
            where: {
              productId_imageId: {
                productId: productImage.productId,
                imageId: existingImage.id
              }
            }
          });

          if (!existingRelation) {
            await prisma.productImageRelation.create({
              data: {
                productId: productImage.productId,
                imageId: existingImage.id,
                isPrimary: productImage.size === 'HOME', // Set HOME size as primary
                sortOrder: getSortOrderForSize(productImage.size)
              }
            });
          }
          skippedCount++;
          continue;
        }

        // Get file information
        const filePath = path.join(process.cwd(), 'uploads', productImage.filename);
        let fileSize = 0;
        let width: number | undefined;
        let height: number | undefined;

        try {
          const stats = fs.statSync(filePath);
          fileSize = stats.size;
          
          // Try to get image dimensions (optional - requires sharp or similar)
          // For now, we'll set reasonable defaults based on size
          const dimensions = getDefaultDimensionsForSize(productImage.size);
          width = dimensions.width;
          height = dimensions.height;
        } catch (error) {
          console.warn(`⚠️ Could not get file stats for ${productImage.filename}`);
          fileSize = 0;
        }

        // Create Image record
        const image = await prisma.image.create({
          data: {
            id: uuidv4(),
            name: `${productImage.product.name} - ${productImage.size}`,
            description: `${productImage.size} size image for ${productImage.product.name}`,
            originalName: productImage.filename,
            filename: productImage.filename,
            path: filePath,
            url: productImage.url,
            mimeType: getMimeTypeFromFilename(productImage.filename),
            size: fileSize,
            type: ImageType.PRODUCT,
            imageSize: productImage.size,
            width,
            height,
            alt: `${productImage.product.name} ${productImage.size} image`,
            isActive: true,
            sortOrder: getSortOrderForSize(productImage.size),
            tags: [
              productImage.product.brand?.name || 'unknown-brand',
              productImage.product.category?.name || 'unknown-category',
              productImage.size.toLowerCase()
            ].filter(Boolean),
            uploadedById: null // Set to null since we don't have upload info
          }
        });

        // Create ProductImageRelation
        await prisma.productImageRelation.create({
          data: {
            productId: productImage.productId,
            imageId: image.id,
            isPrimary: productImage.size === 'HOME', // Set HOME size as primary
            sortOrder: getSortOrderForSize(productImage.size)
          }
        });

        migratedCount++;

        if (migratedCount % 20 === 0) {
          console.log(`✅ Migrated ${migratedCount} images so far...`);
        }

      } catch (error) {
        console.error(`❌ Error migrating ProductImage ${productImage.id}:`, error);
      }
    }

    console.log(`🎉 Migration completed successfully!`);
    console.log(`✅ Migrated: ${migratedCount} images`);
    console.log(`⚠️ Skipped: ${skippedCount} images (already existed)`);

    // Show final counts
    const finalCounts = await prisma.$transaction([
      prisma.image.count(),
      prisma.productImageRelation.count(),
      prisma.productImage.count()
    ]);

    console.log(`📊 Final counts:`);
    console.log(`   Image records: ${finalCounts[0]}`);
    console.log(`   ProductImageRelation records: ${finalCounts[1]}`);
    console.log(`   ProductImage records: ${finalCounts[2]} (kept for compatibility)`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

function getSortOrderForSize(size: ImageSize): number {
  const order = {
    HOME: 1,
    LARGE: 2,
    MEDIUM: 3,
    SMALL: 4
  };
  return order[size] || 999;
}

function getMimeTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

function getDefaultDimensionsForSize(size: ImageSize): { width: number; height: number } {
  const dimensions = {
    HOME: { width: 800, height: 600 },
    LARGE: { width: 600, height: 450 },
    MEDIUM: { width: 400, height: 300 },
    SMALL: { width: 200, height: 150 }
  };
  return dimensions[size] || { width: 400, height: 300 };
}

async function main() {
  try {
    await migrateProductImagesToImageSystem();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { migrateProductImagesToImageSystem };
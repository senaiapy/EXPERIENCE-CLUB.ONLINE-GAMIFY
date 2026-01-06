import { PrismaService } from '../src/prisma/prisma.service';
import { ImageType, ImageSize } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

interface PhpImageInfo {
  originalPath: string;
  filename: string;
  size: ImageSize | null;
  type: ImageType;
  hash: string;
  extension: string;
}

class PhpImageMigrator {
  private prisma = new PrismaService();
  private phpImagesPath = path.join(process.cwd(), 'php-images');
  private uploadsPath = path.join(process.cwd(), 'uploads');

  async migrate() {
    console.log('🚀 Starting PHP images migration...');
    
    try {
      // Ensure uploads directory exists
      await fs.mkdir(this.uploadsPath, { recursive: true });

      // Process different image types
      await this.processBanners();
      await this.processBrands(); 
      await this.processProducts();
      
      console.log('✅ Migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async processBanners() {
    console.log('📱 Processing banner images...');
    
    const bannersPath = path.join(this.phpImagesPath, 'banners');
    
    try {
      const files = await fs.readdir(bannersPath);
      
      for (const file of files) {
        const filePath = path.join(bannersPath, file);
        await this.processImage(filePath, ImageType.BANNER, null);
      }
      
      console.log(`✅ Processed ${files.length} banner images`);
    } catch (error) {
      console.log('⚠️ No banner images found or error processing:', error.message);
    }
  }

  private async processBrands() {
    console.log('🏷️ Processing brand images...');
    
    const brandsPath = path.join(this.phpImagesPath, 'brands');
    
    try {
      const files = await fs.readdir(brandsPath);
      
      for (const file of files) {
        const filePath = path.join(brandsPath, file);
        await this.processImage(filePath, ImageType.BRAND, null);
      }
      
      console.log(`✅ Processed ${files.length} brand images`);
    } catch (error) {
      console.log('⚠️ No brand images found or error processing:', error.message);
    }
  }

  private async processProducts() {
    console.log('📦 Processing product images...');
    
    const productsPath = path.join(this.phpImagesPath, 'products');
    
    try {
      const files = await fs.readdir(productsPath);
      
      // Group images by hash (same product, different sizes)
      const imageGroups = this.groupImagesByHash(files);
      
      let processedCount = 0;
      
      for (const [hash, imageFiles] of Object.entries(imageGroups)) {
        for (const imageFile of imageFiles) {
          const filePath = path.join(productsPath, imageFile);
          const imageInfo = this.parseProductImageName(imageFile);
          
          if (imageInfo) {
            await this.processImage(filePath, ImageType.PRODUCT, imageInfo.size);
            processedCount++;
          }
        }
      }
      
      console.log(`✅ Processed ${processedCount} product images (${Object.keys(imageGroups).length} unique products)`);
    } catch (error) {
      console.log('⚠️ No product images found or error processing:', error.message);
    }
  }

  private groupImagesByHash(files: string[]): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    
    for (const file of files) {
      const imageInfo = this.parseProductImageName(file);
      if (imageInfo) {
        if (!groups[imageInfo.hash]) {
          groups[imageInfo.hash] = [];
        }
        groups[imageInfo.hash].push(file);
      }
    }
    
    return groups;
  }

  private parseProductImageName(filename: string): PhpImageInfo | null {
    // Parse filenames like: home_01e257c787fae6675ef6af6541524ff9.webp
    const match = filename.match(/^(home|small|medium|large)_([a-f0-9]{32})\.(jpg|jpeg|png|webp)$/i);
    
    if (!match) return null;
    
    const [, sizeStr, hash, extension] = match;
    
    let size: ImageSize | null = null;
    switch (sizeStr.toLowerCase()) {
      case 'home':
        size = ImageSize.HOME;
        break;
      case 'small':
        size = ImageSize.SMALL;
        break;
      case 'medium':
        size = ImageSize.MEDIUM;
        break;
      case 'large':
        size = ImageSize.LARGE;
        break;
    }
    
    return {
      originalPath: '',
      filename,
      size,
      type: ImageType.PRODUCT,
      hash,
      extension
    };
  }

  private async processImage(originalPath: string, type: ImageType, size: ImageSize | null) {
    try {
      const stats = await fs.stat(originalPath);
      const buffer = await fs.readFile(originalPath);
      
      // Generate new filename
      const originalFilename = path.basename(originalPath);
      const extension = path.extname(originalFilename);
      const nameWithoutExt = path.basename(originalFilename, extension);
      const newFilename = `migrated_${nameWithoutExt}${extension}`;
      const newPath = path.join(this.uploadsPath, newFilename);
      
      // Check if image already exists
      const existingImage = await this.prisma.image.findUnique({
        where: { filename: newFilename }
      });
      
      if (existingImage) {
        console.log(`⏭️ Skipping ${originalFilename} (already exists)`);
        return;
      }
      
      // Determine MIME type based on file extension
      let mimeType = 'image/jpeg'; // default
      const fileExtension = path.extname(originalFilename).toLowerCase();
      
      switch (fileExtension) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
      }
      
      // Copy file to uploads directory
      await fs.copyFile(originalPath, newPath);
      
      // Create database record
      const imageRecord = await this.prisma.image.create({
        data: {
          name: this.generateImageName(originalFilename, type, size),
          originalName: originalFilename,
          filename: newFilename,
          path: newPath,
          url: `/uploads/${newFilename}`,
          mimeType,
          size: stats.size,
          type,
          imageSize: size,
          isActive: true,
          sortOrder: 0,
          tags: this.generateTags(originalFilename, type, size),
        }
      });
      
      console.log(`✅ Migrated: ${originalFilename} -> ${newFilename} (ID: ${imageRecord.id})`);
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${originalPath}:`, error.message);
    }
  }

  private generateImageName(filename: string, type: ImageType, size: ImageSize | null): string {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    const typeStr = type.toLowerCase();
    const sizeStr = size ? `_${size.toLowerCase()}` : '';
    
    return `${typeStr}${sizeStr}_${nameWithoutExt}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  private generateTags(filename: string, type: ImageType, size: ImageSize | null): string[] {
    const tags = ['migrated', type.toLowerCase()];
    
    if (size) {
      tags.push(size.toLowerCase());
    }
    
    // Add tags based on filename patterns
    if (filename.includes('perfume')) tags.push('perfume');
    if (filename.includes('banner')) tags.push('banner');
    if (filename.includes('logo')) tags.push('logo');
    
    return tags;
  }
}

// Run the migration
async function main() {
  console.log('🔄 Starting PHP to TypeScript images migration...');
  
  const migrator = new PhpImageMigrator();
  
  try {
    await migrator.migrate();
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export default PhpImageMigrator;
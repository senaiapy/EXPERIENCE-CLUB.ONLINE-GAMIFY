import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import { ImageType, ImageSize } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto, userId?: string) {
    return this.prisma.image.create({
      data: {
        ...createImageDto,
        uploadedById: userId,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        },
        productRelations: {
          include: { product: true }
        },
        brandRelations: {
          include: { brand: true }
        },
        categoryRelations: {
          include: { category: true }
        }
      }
    });
  }

  async findAll(query: QueryImageDto) {
    const { page = 1, limit = 20, type, imageSize, search, isActive, mimeType, tag, sortBy, sortOrder } = query;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};

    if (type) where.type = type;
    if (imageSize) where.imageSize = imageSize;
    if (isActive !== undefined) where.isActive = isActive;
    if (mimeType) where.mimeType = { contains: mimeType, mode: 'insensitive' };
    if (tag) where.tags = { has: tag };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [images, total] = await Promise.all([
      this.prisma.image.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy as string]: sortOrder } : { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true }
          },
          productRelations: {
            include: { product: { select: { id: true, name: true, slug: true } } }
          },
          brandRelations: {
            include: { brand: { select: { id: true, name: true, slug: true } } }
          },
          categoryRelations: {
            include: { category: { select: { id: true, name: true, slug: true } } }
          },
          _count: {
            select: {
              productRelations: true,
              brandRelations: true,
              categoryRelations: true
            }
          }
        }
      }),
      this.prisma.image.count({ where })
    ]);

    return {
      images,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async findOne(id: string) {
    const image = await this.prisma.image.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        },
        productRelations: {
          include: { product: { select: { id: true, name: true, slug: true, price: true } } }
        },
        brandRelations: {
          include: { brand: { select: { id: true, name: true, slug: true } } }
        },
        categoryRelations: {
          include: { category: { select: { id: true, name: true, slug: true } } }
        }
      }
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    const image = await this.findOne(id);
    
    return this.prisma.image.update({
      where: { id },
      data: updateImageDto,
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        },
        productRelations: {
          include: { product: true }
        },
        brandRelations: {
          include: { brand: true }
        },
        categoryRelations: {
          include: { category: true }
        }
      }
    });
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    
    // Delete physical file
    try {
      await fs.unlink(image.path);
    } catch (error) {
      console.warn(`Failed to delete physical file: ${image.path}`, error);
    }

    return this.prisma.image.delete({
      where: { id }
    });
  }

  async uploadFile(file: Express.Multer.File, imageData: Partial<CreateImageDto>, userId?: string) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);
    const url = `/uploads/${filename}`;

    // Process and save the image
    let processedBuffer = file.buffer;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const sharpImage = sharp(file.buffer);
      const metadata = await sharpImage.metadata();
      width = metadata.width;
      height = metadata.height;

      // Optimize image based on type
      if (imageData.imageSize) {
        switch (imageData.imageSize) {
          case ImageSize.HOME:
            processedBuffer = await sharpImage.resize(400, 400, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
            break;
          case ImageSize.SMALL:
            processedBuffer = await sharpImage.resize(150, 150, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
            break;
          case ImageSize.MEDIUM:
            processedBuffer = await sharpImage.resize(300, 300, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
            break;
          case ImageSize.LARGE:
            processedBuffer = await sharpImage.resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer();
            break;
        }
      }
    } catch (error) {
      console.warn('Image processing failed, using original:', error);
    }

    await fs.writeFile(filePath, processedBuffer);

    // Create image record
    const createImageDto: CreateImageDto = {
      name: imageData.name || file.originalname,
      description: imageData.description,
      originalName: file.originalname,
      filename,
      path: filePath,
      url,
      mimeType: file.mimetype,
      size: processedBuffer.length,
      type: imageData.type || ImageType.OTHER,
      imageSize: imageData.imageSize,
      width,
      height,
      alt: imageData.alt,
      isActive: imageData.isActive !== false,
      sortOrder: imageData.sortOrder || 0,
      tags: imageData.tags || [],
      metadata: imageData.metadata,
    };

    return this.create(createImageDto, userId);
  }

  async attachToProduct(imageId: string, productId: string, isPrimary: boolean = false, sortOrder: number = 0) {
    // Check if image and product exist
    await this.findOne(imageId);
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // If setting as primary, unset other primary images for this product
    if (isPrimary) {
      await this.prisma.productImageRelation.updateMany({
        where: { productId },
        data: { isPrimary: false }
      });
    }

    return this.prisma.productImageRelation.upsert({
      where: { productId_imageId: { productId, imageId } },
      create: { productId, imageId, isPrimary, sortOrder },
      update: { isPrimary, sortOrder },
      include: {
        image: true,
        product: { select: { id: true, name: true, slug: true } }
      }
    });
  }

  async attachToBrand(imageId: string, brandId: string, isPrimary: boolean = false) {
    await this.findOne(imageId);
    const brand = await this.prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }

    if (isPrimary) {
      await this.prisma.brandImageRelation.updateMany({
        where: { brandId },
        data: { isPrimary: false }
      });
    }

    return this.prisma.brandImageRelation.upsert({
      where: { brandId_imageId: { brandId, imageId } },
      create: { brandId, imageId, isPrimary },
      update: { isPrimary },
      include: {
        image: true,
        brand: { select: { id: true, name: true, slug: true } }
      }
    });
  }

  async attachToCategory(imageId: string, categoryId: string, isPrimary: boolean = false) {
    await this.findOne(imageId);
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    if (isPrimary) {
      await this.prisma.categoryImageRelation.updateMany({
        where: { categoryId },
        data: { isPrimary: false }
      });
    }

    return this.prisma.categoryImageRelation.upsert({
      where: { categoryId_imageId: { categoryId, imageId } },
      create: { categoryId, imageId, isPrimary },
      update: { isPrimary },
      include: {
        image: true,
        category: { select: { id: true, name: true, slug: true } }
      }
    });
  }

  async detachFromProduct(imageId: string, productId: string) {
    return this.prisma.productImageRelation.delete({
      where: { productId_imageId: { productId, imageId } }
    });
  }

  async detachFromBrand(imageId: string, brandId: string) {
    return this.prisma.brandImageRelation.delete({
      where: { brandId_imageId: { brandId, imageId } }
    });
  }

  async detachFromCategory(imageId: string, categoryId: string) {
    return this.prisma.categoryImageRelation.delete({
      where: { categoryId_imageId: { categoryId, imageId } }
    });
  }

  async getImagesByType(type: ImageType, query?: QueryImageDto) {
    return this.findAll({ ...query, type });
  }

  async getProductImages(productId: string) {
    return this.prisma.productImageRelation.findMany({
      where: { productId },
      include: { image: true },
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }]
    });
  }

  async getBrandImages(brandId: string) {
    return this.prisma.brandImageRelation.findMany({
      where: { brandId },
      include: { image: true },
      orderBy: { isPrimary: 'desc' }
    });
  }

  async getCategoryImages(categoryId: string) {
    return this.prisma.categoryImageRelation.findMany({
      where: { categoryId },
      include: { image: true },
      orderBy: { isPrimary: 'desc' }
    });
  }
}
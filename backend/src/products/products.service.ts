import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ImageSize } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const {
      name,
      description,
      price,
      stock,
      brandId,
      categoryId,
      imageUrl,
      price_sale,
      stockStatus,
      specifications,
      details,
      referenceId,
      tags
    } = createProductDto;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create product
    const product = await this.prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        brandId,
        categoryId,
        price_sale: price_sale ? price_sale.toString() : undefined,
        stockStatus: stockStatus || 'Disponible',
        stockQuantity: stock ? stock.toString() : '0',
        specifications: specifications || '',
        details: details || '',
        referenceId: referenceId || '',
        tags: tags || [],
      },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });

    // Download and save image if URL provided
    if (imageUrl) {
      try {
        await this.downloadAndSaveProductImage(product.id, imageUrl);
      } catch (error) {
        console.error('Failed to download product image:', error);
        // Don't fail the product creation if image download fails
      }
    }

    // Fetch product again with images
    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });
  }

  private async downloadAndSaveProductImage(productId: string, imageUrl: string): Promise<void> {
    try {
      // Import axios dynamically
      const axios = require('axios');

      // Download image
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
      });

      // Get file extension from URL or content-type
      let ext = path.extname(imageUrl).split('?')[0];
      if (!ext || ext === '') {
        const contentType = response.headers['content-type'];
        if (contentType?.includes('jpeg') || contentType?.includes('jpg')) ext = '.jpg';
        else if (contentType?.includes('png')) ext = '.png';
        else if (contentType?.includes('webp')) ext = '.webp';
        else ext = '.jpg'; // default
      }

      // Generate filename
      const filename = `product-${productId}${ext}`;

      // Ensure public/images directory exists
      const imagesDir = path.join(process.cwd(), '..', 'admin', 'public', 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Save file
      const filepath = path.join(imagesDir, filename);
      fs.writeFileSync(filepath, response.data);

      // Create ProductImage records for different sizes
      const imageSizes: ImageSize[] = ['SMALL', 'MEDIUM', 'LARGE', 'HOME'];

      for (const size of imageSizes) {
        await this.prisma.productImage.create({
          data: {
            filename,
            size,
            url: `/images/${filename}`,
            productId,
          },
        });
      }

      console.log(`Successfully downloaded and saved image for product ${productId}: ${filename}`);
    } catch (error) {
      console.error(`Failed to download image from ${imageUrl}:`, error.message);
      throw error;
    }
  }

  async findAll(queryDto: QueryProductDto) {
    const {
      page = 1,
      limit = 20,
      search,
      brandId,
      categoryId,
      minPrice,
      maxPrice,
      stockStatus,
      tags,
      referenceId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    // stockStatus not available in current schema
    // referenceId not available in current schema

    // Price range filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { brand: { name: { contains: search, mode: 'insensitive' as const } } },
        { category: { name: { contains: search, mode: 'insensitive' as const } } },
      ];
    }

    // Tags filtering not available in current schema

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: {
          brand: true,
          category: true,
          images: true,
        },
        orderBy: [
          { stock: 'desc' }, // Available products first
          { [sortBy]: sortOrder },
        ],
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters: {
        search,
        brandId,
        categoryId,
        minPrice,
        maxPrice,
        stockStatus,
        tags,
        referenceId,
        sortBy,
        sortOrder,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    const updateData: any = { ...updateProductDto };

    // Update slug if name changed
    if (updateProductDto.name) {
      updateData.slug = updateProductDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Stock is handled directly by the stock field

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    
    // Note: Image cleanup would need to be handled via ProductImage relation

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async addImage(productId: string, file: Express.Multer.File, size: ImageSize) {
    const product = await this.findOne(productId);
    
    // Check if image with this size already exists
    const existingImage = await this.prisma.productImage.findUnique({
      where: {
        productId_size: {
          productId,
          size,
        },
      },
    });

    if (existingImage) {
      // Remove old image file
      const oldImagePath = path.join(process.cwd(), 'uploads', existingImage.filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      // Update with new image
      return this.prisma.productImage.update({
        where: { id: existingImage.id },
        data: {
          filename: file.filename,
          url: `/uploads/${file.filename}`,
        },
      });
    } else {
      // Create new image
      return this.prisma.productImage.create({
        data: {
          filename: file.filename,
          size,
          url: `/uploads/${file.filename}`,
          productId,
        },
      });
    }
  }

  async removeImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    // Remove file from filesystem
    const imagePath = path.join(process.cwd(), 'uploads', image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async addPublicImage(productId: string, file: Express.Multer.File) {
    const product = await this.findOne(productId);

    // Check if image already exists for this product in MEDIUM size (default for public images)
    const existingImage = await this.prisma.productImage.findFirst({
      where: {
        productId,
        size: 'MEDIUM',
      },
    });

    const imageUrl = `/images/${file.filename}`;

    if (existingImage) {
      // Remove old image file from public/images
      const oldImagePath = path.join(process.cwd(), 'public', 'images', existingImage.filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Update with new image
      return this.prisma.productImage.update({
        where: { id: existingImage.id },
        data: {
          filename: file.filename,
          url: imageUrl,
        },
      });
    } else {
      // Create new image entry
      return this.prisma.productImage.create({
        data: {
          filename: file.filename,
          size: 'MEDIUM',
          url: imageUrl,
          productId,
        },
      });
    }
  }

  async downloadImageFromUrl(productId: string, imageUrl: string) {
    // Validate product exists
    const product = await this.findOne(productId);

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new BadRequestException('Invalid image URL. Must start with http or https');
    }

    try {
      // Import axios dynamically
      const axios = require('axios');

      // Download image
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000, // 15 seconds timeout
        maxContentLength: 10 * 1024 * 1024, // 10MB max
      });

      // Get file extension from URL or content-type
      let ext = path.extname(imageUrl).split('?')[0];
      if (!ext || ext === '') {
        const contentType = response.headers['content-type'];
        if (contentType?.includes('jpeg') || contentType?.includes('jpg')) ext = '.jpg';
        else if (contentType?.includes('png')) ext = '.png';
        else if (contentType?.includes('webp')) ext = '.webp';
        else if (contentType?.includes('gif')) ext = '.gif';
        else ext = '.jpg'; // default
      }

      // Generate filename
      const timestamp = Date.now();
      const filename = `product-${productId}-${timestamp}${ext}`;

      // Ensure public/images directory exists
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Save file to public/images
      const filepath = path.join(imagesDir, filename);
      fs.writeFileSync(filepath, response.data);

      // Check if image already exists for this product in MEDIUM size
      const existingImage = await this.prisma.productImage.findFirst({
        where: {
          productId,
          size: 'MEDIUM',
        },
      });

      const imageUrlPath = `/images/${filename}`;

      let productImage;

      if (existingImage) {
        // Remove old image file from public/images
        const oldImagePath = path.join(process.cwd(), 'public', 'images', existingImage.filename);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Failed to delete old image:', err);
          }
        }

        // Update with new image
        productImage = await this.prisma.productImage.update({
          where: { id: existingImage.id },
          data: {
            filename: filename,
            url: imageUrlPath,
          },
        });
      } else {
        // Create new image entry
        productImage = await this.prisma.productImage.create({
          data: {
            filename: filename,
            size: 'MEDIUM',
            url: imageUrlPath,
            productId,
          },
        });
      }

      return {
        success: true,
        message: 'Image downloaded and saved successfully',
        image: productImage,
        localPath: imageUrlPath,
      };
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(`Failed to download image: HTTP ${error.response.status}`);
      } else if (error.code === 'ETIMEDOUT') {
        throw new BadRequestException('Image download timeout. URL may be unreachable');
      } else {
        throw new BadRequestException(`Failed to download image: ${error.message}`);
      }
    }
  }

  // Enhanced search and filter methods
  async findByColumn(column: string, value: string, queryDto?: QueryProductDto) {
    const allowedColumns = ['name', 'description', 'brandId', 'categoryId'];

    if (!allowedColumns.includes(column)) {
      throw new BadRequestException(`Invalid column: ${column}. Allowed columns: ${allowedColumns.join(', ')}`);
    }

    const page = queryDto?.page || 1;
    const limit = queryDto?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      [column]: column.includes('Id') ? value : { contains: value, mode: 'insensitive' as const }
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: {
          brand: true,
          category: true,
          // images relation updated to new schema
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filter: {
        column,
        value,
      },
    };
  }

  async findByValue(searchValue: string, queryDto?: QueryProductDto) {
    const page = queryDto?.page || 1;
    const limit = queryDto?.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: searchValue, mode: 'insensitive' as const } },
        { description: { contains: searchValue, mode: 'insensitive' as const } },
        { brand: { name: { contains: searchValue, mode: 'insensitive' as const } } },
        { category: { name: { contains: searchValue, mode: 'insensitive' as const } } },
      ],
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: {
          brand: true,
          category: true,
          images: true,
        },
        orderBy: [
          { stock: 'desc' }, // Available products first
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      search: {
        value: searchValue,
      },
    };
  }

  // Enhanced update methods
  async updateByValue(searchValue: string, updateProductDto: UpdateProductDto) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: 'insensitive' as const } },
          { name: { contains: searchValue, mode: 'insensitive' as const } },
        ],
      },
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found matching value: ${searchValue}`);
    }

    const updateData: any = { ...updateProductDto };

    // Update slug if name changed
    if (updateProductDto.name) {
      updateData.slug = updateProductDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Stock is handled directly by the stock field

    const updatedProducts = await Promise.all(
      products.map(product =>
        this.prisma.product.update({
          where: { id: product.id },
          data: updateData,
          include: {
            brand: true,
            category: true,
            // images relation updated to new schema
          },
        })
      )
    );

    return {
      updated: updatedProducts.length,
      products: updatedProducts,
    };
  }

  async updateByColumn(column: string, value: string, updateProductDto: UpdateProductDto) {
    const allowedColumns = ['name', 'description', 'brandId', 'categoryId'];

    if (!allowedColumns.includes(column)) {
      throw new BadRequestException(`Invalid column: ${column}. Allowed columns: ${allowedColumns.join(', ')}`);
    }

    const where: any = {
      [column]: column.includes('Id') ? value : { contains: value, mode: 'insensitive' as const }
    };

    const products = await this.prisma.product.findMany({ where });

    if (products.length === 0) {
      throw new NotFoundException(`No products found with ${column} matching: ${value}`);
    }

    const updateData: any = { ...updateProductDto };

    // Update slug if name changed
    if (updateProductDto.name) {
      updateData.slug = updateProductDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Stock is handled directly by the stock field

    const updatedProducts = await Promise.all(
      products.map(product =>
        this.prisma.product.update({
          where: { id: product.id },
          data: updateData,
          include: {
            brand: true,
            category: true,
            // images relation updated to new schema
          },
        })
      )
    );

    return {
      updated: updatedProducts.length,
      products: updatedProducts,
    };
  }

  // Enhanced delete methods
  async deleteByValue(searchValue: string) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: 'insensitive' as const } },
          { name: { contains: searchValue, mode: 'insensitive' as const } },
        ],
      },
      include: { images: true },
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found matching value: ${searchValue}`);
    }

    // Remove associated images from filesystem
    for (const product of products) {
      // TODO: Fix image handling - current schema mismatch
    }

    const deleteResult = await this.prisma.product.deleteMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: 'insensitive' as const } },
          { name: { contains: searchValue, mode: 'insensitive' as const } },
        ],
      },
    });

    return {
      deleted: deleteResult.count,
      searchValue,
    };
  }

  async deleteByColumn(column: string, value: string) {
    const allowedColumns = ['name', 'description', 'brandId', 'categoryId'];

    if (!allowedColumns.includes(column)) {
      throw new BadRequestException(`Invalid column: ${column}. Allowed columns: ${allowedColumns.join(', ')}`);
    }

    const where: any = {
      [column]: column.includes('Id') ? value : { contains: value, mode: 'insensitive' as const }
    };

    const products = await this.prisma.product.findMany({
      where,
      include: { images: true },
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products found with ${column} matching: ${value}`);
    }

    // Remove associated images from filesystem
    for (const product of products) {
      // TODO: Fix image handling - current schema mismatch
    }

    const deleteResult = await this.prisma.product.deleteMany({ where });

    return {
      deleted: deleteResult.count,
      filter: {
        column,
        value,
      },
    };
  }
}

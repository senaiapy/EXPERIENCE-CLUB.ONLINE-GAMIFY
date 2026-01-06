import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto, createPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const { name, imageUrl, description } = createBrandDto;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return this.prisma.brand.create({
      data: {
        name,
        slug,
        imageUrl,
        description,
      },
    });
  }

  async findAll(paginationDto: PaginationDto, search?: string, includeProducts = false) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' as const };
    }

    const include: any = {};
    if (includeProducts) {
      include._count = { select: { products: true } };
    }

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        skip,
        take: limit,
        where,
        include,
        orderBy: { name: 'asc' },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data: brands,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with slug ${slug} not found`);
    }

    return brand;
  }

  async searchByName(name: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = {
      name: { contains: name, mode: 'insensitive' as const },
    };

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        skip,
        take: limit,
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data: brands,
      pagination: createPaginationMeta(page, limit, total),
      search: { name },
    };
  }

  async getBrandProducts(id: string, paginationDto: PaginationDto) {
    const brand = await this.findOne(id);
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where: { brandId: id },
        include: {
          category: true,
          images: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { brandId: id } }),
    ]);

    return {
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
      },
      data: products,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);

    const updateData: any = { ...updateBrandDto };

    if (updateBrandDto.name) {
      updateData.slug = updateBrandDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateData,
    });
  }

  async updateByName(name: string, updateBrandDto: UpdateBrandDto) {
    const brands = await this.prisma.brand.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' as const },
      },
    });

    if (brands.length === 0) {
      throw new NotFoundException(`No brands found matching name: ${name}`);
    }

    const updateData: any = { ...updateBrandDto };

    if (updateBrandDto.name) {
      updateData.slug = updateBrandDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedBrands = await Promise.all(
      brands.map(brand =>
        this.prisma.brand.update({
          where: { id: brand.id },
          data: updateData,
        })
      )
    );

    return {
      updated: updatedBrands.length,
      brands: updatedBrands,
    };
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    // Check if brand has products
    const productCount = await this.prisma.product.count({
      where: { brandId: id },
    });

    if (productCount > 0) {
      throw new ConflictException(`Cannot delete brand with ${productCount} products. Remove products first.`);
    }

    return this.prisma.brand.delete({
      where: { id },
    });
  }

  async removeByName(name: string) {
    const brands = await this.prisma.brand.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' as const },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (brands.length === 0) {
      throw new NotFoundException(`No brands found matching name: ${name}`);
    }

    // Check if any brand has products
    const brandsWithProducts = brands.filter(brand => brand._count.products > 0);
    if (brandsWithProducts.length > 0) {
      throw new ConflictException(
        `Cannot delete brands with products. ${brandsWithProducts.length} brands have products.`
      );
    }

    const deleteResult = await this.prisma.brand.deleteMany({
      where: {
        name: { contains: name, mode: 'insensitive' as const },
      },
    });

    return {
      deleted: deleteResult.count,
      searchName: name,
    };
  }
}

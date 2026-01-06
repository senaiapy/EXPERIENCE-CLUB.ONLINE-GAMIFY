import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto, createPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return this.prisma.category.create({
      data: {
        name,
        slug,
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

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        where,
        include,
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async searchByName(name: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = {
      name: { contains: name, mode: 'insensitive' as const },
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
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
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      pagination: createPaginationMeta(page, limit, total),
      search: { name },
    };
  }

  async getCategoryProducts(id: string, paginationDto: PaginationDto) {
    const category = await this.findOne(id);
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where: { categoryId: id },
        include: {
          brand: true,
          images: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { categoryId: id } }),
    ]);

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      data: products,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    const updateData: any = { ...updateCategoryDto };

    if (updateCategoryDto.name) {
      updateData.slug = updateCategoryDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async updateByName(name: string, updateCategoryDto: UpdateCategoryDto) {
    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' as const },
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException(`No categories found matching name: ${name}`);
    }

    const updateData: any = { ...updateCategoryDto };

    if (updateCategoryDto.name) {
      updateData.slug = updateCategoryDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedCategories = await Promise.all(
      categories.map(category =>
        this.prisma.category.update({
          where: { id: category.id },
          data: updateData,
        })
      )
    );

    return {
      updated: updatedCategories.length,
      categories: updatedCategories,
    };
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Check if category has products
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new ConflictException(`Cannot delete category with ${productCount} products. Remove products first.`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async removeByName(name: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' as const },
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException(`No categories found matching name: ${name}`);
    }

    // Check if any category has products
    const categoriesWithProducts = categories.filter(category => category._count.products > 0);
    if (categoriesWithProducts.length > 0) {
      throw new ConflictException(
        `Cannot delete categories with products. ${categoriesWithProducts.length} categories have products.`
      );
    }

    const deleteResult = await this.prisma.category.deleteMany({
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
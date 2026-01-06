import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            brand: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: wishlistItems,
      count: wishlistItems.length,
    };
  }

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    await this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    return this.getWishlist(userId);
  }

  async clearWishlist(userId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { userId },
    });

    return { message: 'Wishlist cleared successfully' };
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { isInWishlist: !!item };
  }
}
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { CoinsService } from '../game/coins/coins.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CoinsService))
    private coinsService: CoinsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const {
      shippingAddress,
      shippingCity,
      shippingCountry,
      postalCode,
      phone,
      paymentMethod,
      shippingCost = 0,
      tax = 0,
      notes,
      coinsToUse = 0,
    } = createOrderDto;

    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock availability for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${item.product.name}. Available: ${item.product.stock}`,
        );
      }
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Calculate total before coin discount
    const totalBeforeCoins = subtotal + shippingCost + tax;

    // Validate coin usage
    let coinDiscount = 0;
    if (coinsToUse > 0) {
      const userBalance = await this.coinsService.getBalance(userId);

      if (coinsToUse > userBalance) {
        throw new BadRequestException('Insufficient coin balance');
      }

      // 1 coin = 1 USD
      coinDiscount = coinsToUse;

      if (coinDiscount > totalBeforeCoins) {
        throw new BadRequestException('Coin discount cannot exceed order total');
      }
    }

    // Calculate final total after coin discount
    const total = totalBeforeCoins - coinDiscount;

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Deduct coins if used
      if (coinsToUse > 0) {
        await this.coinsService.deductCoins(
          userId,
          coinsToUse,
          TransactionType.PURCHASE,
          `Purchase - Order`,
          undefined,
          'order',
        );
      }

      // Create order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          subtotal,
          total,
          tax,
          shippingCost,
          shippingAddress,
          shippingCity,
          shippingCountry,
          postalCode,
          phone,
          paymentMethod,
          notes,
          coinsUsed: coinsToUse,
          coinDiscount: coinDiscount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                  brand: true,
                  category: true,
                },
              },
            },
          },
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(queryDto: QueryOrderDto) {
    const { page = 1, limit = 10, status, paymentStatus } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string, isAdmin?: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user has permission to view this order
    if (!isAdmin && userId && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async findUserOrders(userId: string, queryDto: QueryOrderDto) {
    const { page = 1, limit = 10, status, paymentStatus } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      todayOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayOrders,
    };
  }
}
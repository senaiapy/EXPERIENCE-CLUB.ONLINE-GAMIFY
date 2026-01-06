import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutOrderDto } from './dto/create-checkout-order.dto';

@Injectable()
export class CheckoutApiService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createCheckoutOrderDto: CreateCheckoutOrderDto) {
    const {
      email,
      name: rawName,
      phone: rawPhone,
      shippingAddress: rawAddress,
      shippingCity: rawCity,
      shippingCountry: rawCountry,
      postalCode,
      paymentMethod: rawPaymentMethod,
      shippingCost = 0,
      tax = 0,
      items: rawItems,
      notes,
    } = createCheckoutOrderDto;

    // Fill in default values for missing fields
    const name = rawName || email.split('@')[0] || 'Customer';
    const phone = rawPhone || 'No phone';
    const shippingAddress = rawAddress || 'No address provided';
    const shippingCity = rawCity || 'N/A';
    const shippingCountry = rawCountry || 'Paraguay';
    const paymentMethod = rawPaymentMethod || 'CASH';

    // Validate that items array is not empty
    if (!rawItems || rawItems.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Process items: normalize productId (can be name), quantity, and price
    const items = await Promise.all(
      rawItems.map(async (item) => {
        // Try to find product by ID first, then by name
        let product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        // If not found by ID, try searching by name
        if (!product) {
          product = await this.prisma.product.findFirst({
            where: {
              OR: [
                { name: { contains: item.productId, mode: 'insensitive' } },
                { slug: { contains: item.productId, mode: 'insensitive' } },
                { referenceId: item.productId },
              ],
            },
          });
        }

        if (!product) {
          throw new NotFoundException(
            `Product not found: ${item.productId}`,
          );
        }

        // Convert price to number if it's a string
        let price = item.price;
        if (price !== undefined && price !== null) {
          price = typeof price === 'string' ? parseFloat(price) : price;
          if (isNaN(price)) {
            throw new BadRequestException(
              `Invalid price format for product: ${product.name}`,
            );
          }
        } else {
          // Use product price from database if not provided
          price = product.price;
        }

        // Default quantity to 1 if not provided
        const quantity = item.quantity || 1;

        return {
          productId: product.id,
          product,
          quantity,
          price,
        };
      }),
    );

    // Validate stock for all items
    for (const item of items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user with provided information
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          phone,
          password: '', // Guest user - no password needed
          role: 'USER',
        },
      });
    }

    // Calculate subtotal from items
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Calculate total
    const total = subtotal + shippingCost + tax;

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create order
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
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
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
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

      // Update product stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      success: true,
      message: 'Order created successfully',
      order,
    };
  }
}

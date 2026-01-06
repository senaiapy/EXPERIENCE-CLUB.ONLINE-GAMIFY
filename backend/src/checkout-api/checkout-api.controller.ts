import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CheckoutApiService } from './checkout-api.service';
import { CreateCheckoutOrderDto } from './dto/create-checkout-order.dto';
import { ApiTokenGuard } from './guards/api-token.guard';

@ApiTags('Checkout API')
@ApiBearerAuth('API-Token')
@Controller('checkout-api')
export class CheckoutApiController {
  constructor(private readonly checkoutApiService: CheckoutApiService) {}

  @ApiOperation({
    summary: 'Create order via external API',
    description:
      'Create a new order using bearer token authentication with NEXTAUTH_SECRET. This endpoint is designed for external integrations (e.g., chatbots, third-party services).',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      example: {
        success: true,
        message: 'Order created successfully',
        order: {
          id: 'clm1234567890',
          userId: 'clm0987654321',
          subtotal: 199.98,
          total: 204.98,
          tax: 0,
          shippingCost: 5.0,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: 'CASH',
          shippingAddress: 'Av. Mcal. López 1234',
          shippingCity: 'Asunción',
          shippingCountry: 'Paraguay',
          postalCode: '1234',
          phone: '+595 981 123456',
          notes: 'Please call before delivery',
          createdAt: '2025-11-01T12:00:00.000Z',
          updatedAt: '2025-11-01T12:00:00.000Z',
          user: {
            id: 'clm0987654321',
            email: 'customer@example.com',
            name: 'Juan Pérez',
            phone: '+595 981 123456',
          },
          items: [
            {
              id: 'clm1111111111',
              productId: 'clm2222222222',
              quantity: 2,
              price: 99.99,
              product: {
                id: 'clm2222222222',
                name: 'Product Name',
                slug: 'product-name',
                description: 'Product description',
                price: 99.99,
                stock: 8,
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or insufficient stock',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API token',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @UseGuards(ApiTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() createCheckoutOrderDto: CreateCheckoutOrderDto) {
    return this.checkoutApiService.createOrder(createCheckoutOrderDto);
  }
}

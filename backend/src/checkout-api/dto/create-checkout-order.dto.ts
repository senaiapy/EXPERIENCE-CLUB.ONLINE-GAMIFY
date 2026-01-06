import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID or Product Name (will search by name if not a valid ID)',
    example: 'clm1234567890',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity (default: 1 if not provided)',
    example: 2,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Price per unit (in USD or string format, will be converted to number). If not provided, will use product price from database.',
    example: 99.99,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  price?: number | string;
}

export class CreateCheckoutOrderDto {
  @ApiProperty({
    description: 'Customer email (required)',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Customer name (optional, defaults to email username if not provided)',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Contact phone number (optional, defaults to "No phone" if not provided)',
    example: '+595 981 123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Shipping address (optional, defaults to "No address provided" if not provided)',
    example: 'Av. Mcal. López 1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Shipping city (optional, defaults to "N/A" if not provided)',
    example: 'Asunción',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingCity?: string;

  @ApiProperty({
    description: 'Shipping country (optional, defaults to "Paraguay" if not provided)',
    example: 'Paraguay',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingCountry?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Payment method (optional, defaults to CASH if not provided)',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
    required: false,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Shipping cost (in USD)',
    example: 5.0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({
    description: 'Tax amount (in USD)',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Additional notes',
    example: 'Please call before delivery',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

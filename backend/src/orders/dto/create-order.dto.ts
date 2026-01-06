import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Shipping address',
    example: 'Av. Mcal. López 1234',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    description: 'Shipping city',
    example: 'Asunción',
  })
  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @ApiProperty({
    description: 'Shipping country',
    example: 'Paraguay',
  })
  @IsString()
  @IsNotEmpty()
  shippingCountry: string;

  @ApiProperty({
    description: 'Postal code',
    example: '1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+595 981 123456',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Shipping cost',
    example: 25000,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Please call before delivery',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Number of coins to use for payment',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  coinsToUse?: number;
}
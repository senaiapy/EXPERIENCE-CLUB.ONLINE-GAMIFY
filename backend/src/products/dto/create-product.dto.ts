import { IsString, IsNumber, IsOptional, IsPositive, Min, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Chanel No. 5 Eau de Parfum',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A timeless fragrance that epitomizes elegance and sophistication',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price in Guaraní',
    example: 15000000,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    description: 'Sale price in Guaraní (if on sale)',
    example: 12000000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price_sale?: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Stock status description',
    example: 'In Stock',
  })
  @IsOptional()
  @IsString()
  stockStatus?: string;

  @ApiPropertyOptional({
    description: 'Product specifications',
    example: '100ml bottle, Eau de Parfum concentration',
  })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({
    description: 'Detailed product information',
    example: 'Top notes: Bergamot, Lemon. Heart notes: Rose, Jasmine. Base notes: Sandalwood, Vanilla',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    description: 'Reference ID from external system',
    example: 'REF-12345',
  })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({
    description: 'Product tags for categorization',
    example: ['luxury', 'designer', 'feminine'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Brand ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Image URL to download',
    example: 'https://example.com/product-image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
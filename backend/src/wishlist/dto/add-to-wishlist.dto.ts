import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({
    description: 'Product ID to add to wishlist',
    example: 'clxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
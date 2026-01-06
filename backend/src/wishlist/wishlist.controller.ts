import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 200, description: 'Product added to wishlist successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product already in wishlist' })
  @Post()
  addToWishlist(@Request() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(req.user.userId, addToWishlistDto);
  }

  @ApiOperation({ summary: 'Check if product is in wishlist' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @Get('check/:productId')
  isInWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.isInWishlist(req.user.userId, productId);
  }

  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found in wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @Delete(':productId')
  removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }

  @ApiOperation({ summary: 'Clear wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete()
  clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.userId);
  }
}
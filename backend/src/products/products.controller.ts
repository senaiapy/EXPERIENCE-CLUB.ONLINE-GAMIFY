import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto, UpdateByColumnDto, DeleteByColumnDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ImageSize } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products with advanced filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'stockStatus', required: false, description: 'Filter by stock status' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'referenceId', required: false, description: 'Filter by reference ID' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', enum: ['name', 'price', 'createdAt', 'updatedAt', 'stock'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', enum: ['asc', 'desc'] })
  @Get()
  findAll(@Query() queryDto: QueryProductDto) {
    return this.productsService.findAll(queryDto);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get product by slug (SEO-friendly URL)' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'slug', description: 'Product slug' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Search products by value across multiple fields' })
  @ApiResponse({ status: 200, description: 'Products found successfully' })
  @ApiParam({ name: 'value', description: 'Search value' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @Get('search/value/:value')
  findByValue(
    @Param('value') value: string,
    @Query() queryDto: QueryProductDto,
  ) {
    return this.productsService.findByValue(value, queryDto);
  }

  @ApiOperation({ summary: 'Search products by specific column and value' })
  @ApiResponse({ status: 200, description: 'Products found successfully' })
  @ApiResponse({ status: 400, description: 'Invalid column name' })
  @ApiParam({ name: 'column', description: 'Column name to search in' })
  @ApiParam({ name: 'value', description: 'Value to search for' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @Get('search/column/:column/:value')
  findByColumn(
    @Param('column') column: string,
    @Param('value') value: string,
    @Query() queryDto: QueryProductDto,
  ) {
    return this.productsService.findByColumn(column, value, queryDto);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Update products by search value' })
  @ApiResponse({ status: 200, description: 'Products updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('update/value/:value')
  updateByValue(
    @Param('value') value: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateByValue(value, updateProductDto);
  }

  @ApiOperation({ summary: 'Update products by column and value' })
  @ApiResponse({ status: 200, description: 'Products updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or column name' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('update/column/:column/:value')
  updateByColumn(
    @Param('column') column: string,
    @Param('value') value: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateByColumn(column, value, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: 'Delete products by search value' })
  @ApiResponse({ status: 200, description: 'Products deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('delete/value/:value')
  deleteByValue(@Param('value') value: string) {
    return this.productsService.deleteByValue(value);
  }

  @ApiOperation({ summary: 'Delete products by column and value' })
  @ApiResponse({ status: 200, description: 'Products deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid column name' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('delete/column/:column/:value')
  deleteByColumn(
    @Param('column') column: string,
    @Param('value') value: string,
  ) {
    return this.productsService.deleteByColumn(column, value);
  }

  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiParam({ name: 'size', description: 'Image size', enum: ['SMALL', 'MEDIUM', 'LARGE', 'HOME'] })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/images/:size')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(
    @Param('id') productId: string,
    @Param('size') sizeParam: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const size = sizeParam.toUpperCase() as ImageSize;

    if (!Object.values(ImageSize).includes(size)) {
      throw new BadRequestException('Invalid image size. Must be SMALL, MEDIUM, LARGE, or HOME');
    }

    return this.productsService.addImage(productId, file, size);
  }

  @ApiOperation({ summary: 'Upload product image to public/images folder' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully to public storage' })
  @ApiResponse({ status: 400, description: 'Invalid file or parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/public-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const productId = req.params.id;
          const ext = extname(file.originalname);
          return cb(null, `product-${productId}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadPublicImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.addPublicImage(productId, file);
  }

  @ApiOperation({ summary: 'Delete product image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.productsService.removeImage(imageId);
  }

  @ApiOperation({ summary: 'Download image from URL and save to public/images' })
  @ApiResponse({ status: 201, description: 'Image downloaded and saved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid URL or image download failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({
    description: 'Image URL to download',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          example: 'https://example.com/image.jpg',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/download-image')
  downloadImageFromUrl(
    @Param('id') productId: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.productsService.downloadImageFromUrl(productId, imageUrl);
  }
}

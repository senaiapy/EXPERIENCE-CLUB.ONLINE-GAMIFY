import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @ApiOperation({ summary: 'Get all brands with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Brands retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for brand name' })
  @ApiQuery({ name: 'includeProducts', required: false, description: 'Include product count', example: true })
  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query('search') search?: string, @Query('includeProducts') includeProducts?: boolean) {
    return this.brandsService.findAll(paginationDto, search, includeProducts);
  }

  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get brand by slug' })
  @ApiResponse({ status: 200, description: 'Brand found successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiParam({ name: 'slug', description: 'Brand slug' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Search brands by name' })
  @ApiResponse({ status: 200, description: 'Brands found successfully' })
  @ApiParam({ name: 'name', description: 'Brand name to search for' })
  @Get('search/:name')
  searchByName(@Param('name') name: string, @Query() paginationDto: PaginationDto) {
    return this.brandsService.searchByName(name, paginationDto);
  }

  @ApiOperation({ summary: 'Get products by brand ID' })
  @ApiResponse({ status: 200, description: 'Brand products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @Get(':id/products')
  getBrandProducts(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.brandsService.getBrandProducts(id, paginationDto);
  }

  @ApiOperation({ summary: 'Update brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @ApiOperation({ summary: 'Update brands by name search' })
  @ApiResponse({ status: 200, description: 'Brands updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No brands found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('update/name/:name')
  updateByName(@Param('name') name: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.updateByName(name, updateBrandDto);
  }

  @ApiOperation({ summary: 'Delete brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete brand with products' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }

  @ApiOperation({ summary: 'Delete brands by name search' })
  @ApiResponse({ status: 200, description: 'Brands deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'No brands found' })
  @ApiResponse({ status: 409, description: 'Cannot delete brands with products' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('delete/name/:name')
  removeByName(@Param('name') name: string) {
    return this.brandsService.removeByName(name);
  }
}

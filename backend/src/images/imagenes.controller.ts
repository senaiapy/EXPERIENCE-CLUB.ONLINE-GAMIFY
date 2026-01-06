import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('imagenes')
export class ImagenesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type. Only images are allowed.'), false);
      }
    }
  }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @Req() req: any
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.imagesService.create({
      ...createImageDto,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size
    }, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryImageDto) {
    return this.imagesService.findAll(queryDto);
  }

  @Get('by-type/:type')
  findByType(@Param('type') type: string, @Query() queryDto: QueryImageDto) {
    return this.imagesService.getImagesByType(type as any, queryDto);
  }

  @Get('product/:productId')
  findProductImages(@Param('productId') productId: string) {
    return this.imagesService.getProductImages(productId);
  }

  @Get('brand/:brandId')
  findBrandImages(@Param('brandId') brandId: string) {
    return this.imagesService.getBrandImages(brandId);
  }

  @Get('category/:categoryId')
  findCategoryImages(@Param('categoryId') categoryId: string) {
    return this.imagesService.getCategoryImages(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(id, updateImageDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':imageId/attach/product/:productId')
  attachToProduct(
    @Param('imageId') imageId: string,
    @Param('productId') productId: string,
    @Body() data?: { isPrimary?: boolean; sortOrder?: number }
  ) {
    return this.imagesService.attachToProduct(imageId, productId, data?.isPrimary, data?.sortOrder);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':imageId/detach/product/:productId')
  detachFromProduct(
    @Param('imageId') imageId: string,
    @Param('productId') productId: string
  ) {
    return this.imagesService.detachFromProduct(imageId, productId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':imageId/attach/brand/:brandId')
  attachToBrand(
    @Param('imageId') imageId: string,
    @Param('brandId') brandId: string,
    @Body() data?: { isPrimary?: boolean }
  ) {
    return this.imagesService.attachToBrand(imageId, brandId, data?.isPrimary);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':imageId/detach/brand/:brandId')
  detachFromBrand(
    @Param('imageId') imageId: string,
    @Param('brandId') brandId: string
  ) {
    return this.imagesService.detachFromBrand(imageId, brandId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':imageId/attach/category/:categoryId')
  attachToCategory(
    @Param('imageId') imageId: string,
    @Param('categoryId') categoryId: string,
    @Body() data?: { isPrimary?: boolean }
  ) {
    return this.imagesService.attachToCategory(imageId, categoryId, data?.isPrimary);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':imageId/detach/category/:categoryId')
  detachFromCategory(
    @Param('imageId') imageId: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.imagesService.detachFromCategory(imageId, categoryId);
  }
}
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
import { ImageType, ImageSize } from '@prisma/client';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only image files are allowed!'), false);
      }
    }
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name?: string,
    @Body('description') description?: string,
    @Body('type') type?: ImageType,
    @Body('imageSize') imageSize?: ImageSize,
    @Body('alt') alt?: string,
    @Body('tags') tags?: string,
    @Body('metadata') metadata?: string,
    @Req() req?: any
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageData: Partial<CreateImageDto> = {
      name: name || file.originalname,
      description,
      type: type || ImageType.OTHER,
      imageSize,
      alt,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      metadata: metadata ? JSON.parse(metadata) : undefined
    };

    return this.imagesService.uploadFile(file, imageData, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createImageDto: CreateImageDto, @Req() req: any) {
    return this.imagesService.create(createImageDto, req.user?.id);
  }

  @Get()
  findAll(@Query() query: QueryImageDto) {
    return this.imagesService.findAll(query);
  }

  @Get('by-type/:type')
  findByType(@Param('type') type: ImageType, @Query() query: QueryImageDto) {
    return this.imagesService.getImagesByType(type, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(id, updateImageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }

  // Product image relations
  @UseGuards(JwtAuthGuard)
  @Post(':id/attach/product/:productId')
  attachToProduct(
    @Param('id') imageId: string,
    @Param('productId') productId: string,
    @Body('isPrimary') isPrimary: boolean = false,
    @Body('sortOrder') sortOrder: number = 0
  ) {
    return this.imagesService.attachToProduct(imageId, productId, isPrimary, sortOrder);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/detach/product/:productId')
  detachFromProduct(
    @Param('id') imageId: string,
    @Param('productId') productId: string
  ) {
    return this.imagesService.detachFromProduct(imageId, productId);
  }

  @Get('product/:productId')
  getProductImages(@Param('productId') productId: string) {
    return this.imagesService.getProductImages(productId);
  }

  // Brand image relations
  @UseGuards(JwtAuthGuard)
  @Post(':id/attach/brand/:brandId')
  attachToBrand(
    @Param('id') imageId: string,
    @Param('brandId') brandId: string,
    @Body('isPrimary') isPrimary: boolean = false
  ) {
    return this.imagesService.attachToBrand(imageId, brandId, isPrimary);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/detach/brand/:brandId')
  detachFromBrand(
    @Param('id') imageId: string,
    @Param('brandId') brandId: string
  ) {
    return this.imagesService.detachFromBrand(imageId, brandId);
  }

  @Get('brand/:brandId')
  getBrandImages(@Param('brandId') brandId: string) {
    return this.imagesService.getBrandImages(brandId);
  }

  // Category image relations
  @UseGuards(JwtAuthGuard)
  @Post(':id/attach/category/:categoryId')
  attachToCategory(
    @Param('id') imageId: string,
    @Param('categoryId') categoryId: string,
    @Body('isPrimary') isPrimary: boolean = false
  ) {
    return this.imagesService.attachToCategory(imageId, categoryId, isPrimary);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/detach/category/:categoryId')
  detachFromCategory(
    @Param('id') imageId: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.imagesService.detachFromCategory(imageId, categoryId);
  }

  @Get('category/:categoryId')
  getCategoryImages(@Param('categoryId') categoryId: string) {
    return this.imagesService.getCategoryImages(categoryId);
  }
}
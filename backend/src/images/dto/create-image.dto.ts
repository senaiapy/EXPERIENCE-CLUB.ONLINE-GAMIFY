import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsArray, Min } from 'class-validator';
import { ImageType, ImageSize } from '@prisma/client';

export class CreateImageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  originalName: string;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  url: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(0)
  size: number;

  @IsEnum(ImageType)
  type: ImageType;

  @IsOptional()
  @IsEnum(ImageSize)
  imageSize?: ImageSize;

  @IsOptional()
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  metadata?: any;
}
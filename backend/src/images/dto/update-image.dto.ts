import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-image.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @IsOptional()
  @IsString()
  id?: string;
}
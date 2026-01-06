import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagenesController } from './imagenes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImagesController, ImagenesController],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
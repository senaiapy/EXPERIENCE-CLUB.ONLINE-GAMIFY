import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { MarcasController } from './marcas.controller';

@Module({
  providers: [BrandsService],
  controllers: [BrandsController, MarcasController]
})
export class BrandsModule {}

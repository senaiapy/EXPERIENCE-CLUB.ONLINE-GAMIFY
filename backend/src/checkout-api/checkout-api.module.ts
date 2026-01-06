import { Module } from '@nestjs/common';
import { CheckoutApiController } from './checkout-api.controller';
import { CheckoutApiService } from './checkout-api.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CheckoutApiController],
  providers: [CheckoutApiService],
  exports: [CheckoutApiService],
})
export class CheckoutApiModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinsService } from './coins/coins.service';
import { CoinsController } from './coins/coins.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { ProgressService } from './progress/progress.service';
import { ProgressController } from './progress/progress.controller';
import { ReferralsService } from './referrals/referrals.service';
import { ReferralsController } from './referrals/referrals.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    CoinsController,
    TasksController,
    ProgressController,
    ReferralsController,
  ],
  providers: [
    CoinsService,
    TasksService,
    ProgressService,
    ReferralsService,
  ],
  exports: [
    CoinsService,
    TasksService,
    ProgressService,
    ReferralsService,
  ],
})
export class GameModule {}

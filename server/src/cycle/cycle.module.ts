import { Module } from '@nestjs/common';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
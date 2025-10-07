import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';
import { PrismaService } from '../common/prisma.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audit',
    }),
  ],
  controllers: [AuditsController],
  providers: [AuditsService, PrismaService],
  exports: [AuditsService],
})
export class AuditsModule {}

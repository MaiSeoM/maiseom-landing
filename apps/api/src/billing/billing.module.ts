import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaService } from '../common/prisma.service';
import { AuditsService } from '../audits/audits.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'audit' }),
  ],
  controllers: [BillingController],
  providers: [BillingService, PrismaService, AuditsService],
})
export class BillingModule {}

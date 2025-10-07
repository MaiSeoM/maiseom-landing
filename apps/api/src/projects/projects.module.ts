import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../common/prisma.service';
import { AuditsService } from '../audits/audits.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audit',
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, AuditsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

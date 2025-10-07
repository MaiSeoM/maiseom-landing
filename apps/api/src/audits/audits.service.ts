import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

interface AuditResultPayload {
  seoScore: number;
  aiScore: number;
  summary: string;
  recommendations: Record<string, unknown>;
}

@Injectable()
export class AuditsService {
  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('audit') private readonly auditQueue: Queue,
  ) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  findAll() {
    return this.prisma.audit.findMany({
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(projectId: string, triggeredBy?: string) {
    const audit = await this.prisma.audit.create({
      data: {
        projectId,
        triggeredById: triggeredBy,
        status: 'PENDING',
      },
      include: { project: true },
    });

    await this.auditQueue.add(
      'run',
      {
        auditId: audit.id,
        projectId: audit.projectId,
        domain: audit.project.domain,
      },
      { removeOnComplete: true, removeOnFail: false },
    );

    await this.redis.lpush(
      'maiseom:audit:queue',
      JSON.stringify({
        auditId: audit.id,
        projectId: audit.projectId,
        domain: audit.project.domain,
      }),
    );

    return audit;
  }

  async updateScores(auditId: string, data: AuditResultPayload) {
    return this.prisma.audit.update({
      where: { id: auditId },
      data: {
        seoScore: data.seoScore,
        aiScore: data.aiScore,
        summary: data.summary,
        recommendations: data.recommendations,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }
}

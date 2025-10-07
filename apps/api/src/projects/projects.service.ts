import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId?: string) {
    return this.prisma.project.findMany({
      where: userId ? { userId } : undefined,
      include: {
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async overview(userId?: string) {
    const [projects, audits] = await Promise.all([
      this.prisma.project.count({ where: userId ? { userId } : undefined }),
      this.prisma.audit.findMany({
        where: userId ? { project: { userId } } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { project: true },
      }),
    ]);

    const seoScore =
      audits.reduce((sum, audit) => sum + (audit.seoScore || 0), 0) / (audits.length || 1);
    const aiScore =
      audits.reduce((sum, audit) => sum + (audit.aiScore || 0), 0) / (audits.length || 1);

    return {
      stats: {
        projects,
        seoScore: Number.isFinite(seoScore) ? Math.round(seoScore) : 0,
        aiScore: Number.isFinite(aiScore) ? Math.round(aiScore) : 0,
      },
      latestAudits: audits,
    };
  }

  async create(dto: CreateProjectDto, userId?: string) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        domain: dto.domain,
        userId: userId || (await this.ensureUser()).id,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        audits: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  private async ensureUser() {
    const existing = await this.prisma.user.findFirst();
    if (existing) return existing;
    return this.prisma.user.create({
      data: {
        email: 'demo@maiseom.com',
        name: 'Demo User',
      },
    });
  }
}

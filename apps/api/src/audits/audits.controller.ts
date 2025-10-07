import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuditsService } from './audits.service';

interface CompleteAuditDto {
  seoScore: number;
  aiScore: number;
  summary: string;
  recommendations: Record<string, unknown>;
}

@Controller('audits')
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Get()
  findAll() {
    return this.auditsService.findAll();
  }

  @Post()
  create(@Body('projectId') projectId: string) {
    return this.auditsService.create(projectId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Headers('x-worker-token') token: string, @Body() body: CompleteAuditDto) {
    if ((process.env.WORKER_API_TOKEN || 'change-me') !== token) {
      throw new UnauthorizedException('Invalid worker token');
    }
    return this.auditsService.updateScores(id, body);
  }
}

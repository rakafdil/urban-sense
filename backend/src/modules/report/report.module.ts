import { Module } from '@nestjs/common';
import { ReportService } from './report.service.js';
import { ReportController } from './report.controller.js';
import { MediaService } from './services/media.service.js';
import { AiService } from './services/ai.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [ReportController],
  providers: [ReportService, MediaService, AiService, PrismaService],
})
export class ReportModule {}

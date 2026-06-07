import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { MediaService } from './services/media.service';
import { AiService } from './services/ai.service';
import { ReportCategory } from '@prisma/client';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly aiService: AiService,
    // private readonly gamificationService: GamificationService,
    // private readonly notificationService: NotificationService,
  ) {}

  async createReport(
    userId: string,
    dto: CreateReportDto,
    photoBuffer: Buffer,
  ) {
    const photoUrl = await this.mediaService.uploadImage(photoBuffer);

    if (!dto.longitude || !dto.latitude) {
      throw new BadRequestException('Longitude wajib diisi');
    }
    let aiAnalysis = { category: 'other', severity: 'low', summary: '' };
    try {
      aiAnalysis = await this.aiService.analyzeReportPhoto(
        photoUrl,
        dto.description,
      );
    } catch (error: unknown) {
      let errorMessage = 'Gagal menganalisis gambar';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      this.logger.warn(`AI Analysis failed, using fallback: ${errorMessage}`);
    }

    const newReport = await this.prisma.report.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: aiAnalysis.category as ReportCategory,
        severity: aiAnalysis.severity as 'low' | 'medium' | 'high' | 'critical',
        status: 'open',
        latitude: parseFloat(dto.latitude),
        longitude: parseFloat(dto.longitude),
        address: dto.address,
        photoUrl,
        aiSummary: aiAnalysis.summary,
      },
    });

    // 4. Trigger gamifikasi untuk warga
    // await this.gamificationService.addPoints(userId, 10, 'REPORT_SUBMITTED');

    return newReport;
  }

  async getReportsByUserId(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReports() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });
  }
}

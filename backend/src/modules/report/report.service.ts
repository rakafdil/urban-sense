/**
 * @file src/modules/reports/services/report.service.ts
 * @description Service layer untuk menangani business logic terkait Laporan.
 * Memisahkan tanggung jawab dari Controller (Separation of Concerns).
 */

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly aiService: AiService,
    private readonly gamificationService: GamificationService,
    private readonly notificationService: NotificationService,
  ) {}

  async createReport(
    userId: string,
    dto: CreateReportDto,
    photoBuffer: Buffer,
  ) {
    // 1. Upload ke Cloudinary
    const photoUrl = await this.mediaService.uploadImage(photoBuffer);

    // 2. Auto-Kategorisasi via OpenAI Vision
    let aiAnalysis = { category: 'other', severity: 'low', summary: '' };
    try {
      aiAnalysis = await this.aiService.analyzeReportPhoto(
        photoUrl,
        dto.description,
      );
    } catch (error) {
      this.logger.warn(`AI Analysis failed, using fallback: ${error.message}`);
    }

    // 3. Simpan ke PostgreSQL
    const newReport = await this.prisma.report.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: aiAnalysis.category as any,
        severity: aiAnalysis.severity as any,
        status: 'open',
        latitude: parseFloat(dto.latitude),
        longitude: parseFloat(dto.longitude),
        address: dto.address,
        photoUrl,
        aiSummary: aiAnalysis.summary,
      },
    });

    // 4. Trigger gamifikasi untuk warga
    await this.gamificationService.addPoints(userId, 10, 'REPORT_SUBMITTED');

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

  async updateReportStatus(
    reportId: string,
    adminId: string,
    dto: UpdateReportStatusDto,
  ) {
    // 1. Verifikasi laporan eksis
    const existingReport = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      throw new HttpException('Laporan tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    // 2. Update status
    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: dto.status as any },
    });

    // 3. Catat ke log histori status
    await this.prisma.reportStatusLog.create({
      data: {
        reportId,
        updatedById: adminId,
        oldStatus: existingReport.status as any,
        newStatus: dto.status as any,
        notes: dto.notes || 'Status diperbarui oleh Admin',
      },
    });

    // 4. Kirim notifikasi ke pembuat laporan
    const message = `Status laporan Anda "${existingReport.title}" telah diubah menjadi ${dto.status}.`;
    await this.notificationService.sendPushNotification(
      existingReport.userId,
      'Pembaruan Status Laporan',
      message,
    );

    return updatedReport;
  }
}

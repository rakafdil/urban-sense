/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import multer from 'multer';

import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createReport(
    @Req() req: Request,
    @Body() dto: CreateReportDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      const user = req.user as any;

      if (!photo) {
        throw new HttpException(
          'Foto bukti laporan wajib disertakan.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newReport = await this.reportService.createReport(
        user.id,
        dto,
        photo.buffer,
      );

      return {
        success: true,
        message: 'Laporan berhasil dikirim dan dianalisis.',
        data: newReport,
      };
    } catch (error) {
      this.logger.error(`Failed to create report: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Kesalahan server saat memproses laporan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  async getMyReports(@Req() req: Request) {
    try {
      const user = req.user as any;
      const reports = await this.reportService.getReportsByUserId(user.id);
      return { success: true, data: reports };
    } catch (error) {
      this.logger.error(`Failed to fetch user reports: ${error.message}`);
      throw new HttpException(
        'Gagal mengambil riwayat laporan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllReports() {
    try {
      const reports = await this.reportService.getAllReports();
      return { success: true, data: reports };
    } catch (error) {
      this.logger.error(`Failed to fetch all reports: ${error.message}`);
      throw new HttpException(
        'Gagal mengambil data laporan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  async updateReportStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @Req() req: Request,
  ) {
    try {
      const adminUser = req.user as any;
      const updatedReport = await this.reportService.updateReportStatus(
        id,
        adminUser.id,
        dto,
      );

      return {
        success: true,
        message: 'Status laporan berhasil diperbarui.',
        data: updatedReport,
      };
    } catch (error) {
      this.logger.error(`Failed to update report status: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Gagal memperbarui status laporan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

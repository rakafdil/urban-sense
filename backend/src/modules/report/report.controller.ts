/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import multer from 'multer';

import { CreateReportDto } from './dto/create-report.dto';

import { ReportService } from './report.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateReportWithFileDto } from './dto/create-report-with-file.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('reports')
@UseGuards(JwtGuard, RolesGuard)
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateReportWithFileDto,
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Roles('volunteer')
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
  @Roles('volunteer')
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
  @Roles('admin')
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
}

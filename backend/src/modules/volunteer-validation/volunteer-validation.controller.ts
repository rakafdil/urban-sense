/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

import { VolunteerService } from './volunteer-validation.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GamificationService } from '../../services/gamification.service';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('volunteers')
@UseGuards(JwtGuard, RolesGuard) // Aktifkan JWT dan RBAC
@Roles('volunteer') // HANYA role "volunteer" yang bisa mengakses semua endpoint di controller ini
export class VolunteerController {
  private readonly logger = new Logger(VolunteerController.name);

  constructor(
    private readonly volunteerService: VolunteerService,
    private readonly gamificationService: GamificationService,
  ) {}

  /**
   * Endpoint: GET /api/volunteers/reports/pending
   * Fungsi: Melihat daftar laporan yang belum divalidasi oleh relawan yang sedang login
   */
  @Get('reports/pending')
  async getPendingReports(@Req() req: Request) {
    try {
      const user = req.user as any;
      console.log(user);
      const reports = await this.volunteerService.getPendingValidations(
        user.id,
      );

      return {
        success: true,
        data: reports,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch pending reports: ${errorMessage}`);

      throw new HttpException(
        'Gagal memuat daftar laporan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reports/:reportId/upvote')
  async upvoteReport(@Param('reportId') reportId: string, @Req() req) {
    return this.volunteerService.upvoteReport(reportId, req.user.id);
  }

  @Post('reports/:reportId/downvote')
  async downvoteReport(@Param('reportId') reportId: string, @Req() req) {
    return this.volunteerService.downvoteReport(reportId, req.user.id);
  }
}

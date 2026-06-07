/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../../services/gamification.service';
import { Prisma, ValidationType } from '@prisma/client';

@Injectable()
export class VolunteerService {
  private readonly logger = new Logger(VolunteerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async upvoteReport(reportId: string, volunteerId: string) {
    return this.voteReport(reportId, volunteerId, ValidationType.upvote);
  }

  async downvoteReport(reportId: string, volunteerId: string) {
    return this.voteReport(reportId, volunteerId, ValidationType.downvote);
  }

  private async voteReport(
    reportId: string,
    volunteerId: string,
    vote: ValidationType,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new HttpException('Laporan tidak ditemukan.', HttpStatus.NOT_FOUND);
    }

    const existingValidation = await this.prisma.reportValidation.findUnique({
      where: {
        reportId_userId: {
          reportId,
          userId: volunteerId,
        },
      },
    });

    if (existingValidation) {
      throw new HttpException(
        'Anda sudah memberikan suara pada laporan ini.',
        HttpStatus.CONFLICT,
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const validation = await tx.reportValidation.create({
        data: {
          reportId,
          userId: volunteerId,
          vote,
        },
      });

      await tx.report.update({
        where: { id: reportId },
        data: {
          priorityScore: {
            increment: vote === ValidationType.upvote ? 5 : -2,
          },

          ...(vote === ValidationType.upvote && {
            upvoteCount: {
              increment: 1,
            },
          }),

          ...(vote === ValidationType.downvote && {
            downvoteCount: {
              increment: 1,
            },
          }),
        },
      });

      await this.updateValidationStatus(tx, reportId);

      return validation;
    });

    try {
      await this.gamificationService.addPoints(
        volunteerId,
        vote === ValidationType.upvote ? 20 : 10,
        'REPORT_VALIDATED',
      );
    } catch {
      this.logger.warn(`Gagal menambahkan poin untuk relawan ${volunteerId}`);
    }

    return result;
  }

  private async updateValidationStatus(
    tx: Prisma.TransactionClient,
    reportId: string,
  ) {
    const votes = await tx.reportValidation.groupBy({
      by: ['vote'],
      where: {
        reportId,
      },
      _count: {
        vote: true,
      },
    });

    const upvotes =
      votes.find((v) => v.vote === ValidationType.upvote)?._count.vote ?? 0;

    const downvotes =
      votes.find((v) => v.vote === ValidationType.downvote)?._count.vote ?? 0;

    let validationStatus = 'pending';

    if (upvotes >= 3 && upvotes > downvotes) {
      validationStatus = 'validated';
    } else if (downvotes >= 3 && downvotes > upvotes) {
      validationStatus = 'invalid';
    } else if (upvotes > 0 && downvotes > 0) {
      validationStatus = 'disputed';
    }

    await tx.report.update({
      where: { id: reportId },
      data: {
        validationStatus,
      },
    });
  }

  async getPendingValidations(volunteerId: string) {
    return this.prisma.report.findMany({
      where: {
        status: { in: ['open', 'in_progress'] },
        validations: {
          none: {
            userId: volunteerId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        severity: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        photoUrl: true,
      },
    });
  }
}

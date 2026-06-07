/**
 * @file src/modules/reports/dto/update-report-status.dto.ts
 * @description DTO untuk validasi payload saat Petugas (Admin) mengubah status laporan.
 */

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus, {
    message:
      'Status tidak valid. Pilihan yang diizinkan: open, in_progress, resolved, rejected.',
  })
  status: ReportStatus;

  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks.' })
  @MaxLength(500, { message: 'Catatan maksimal 500 karakter.' })
  notes?: string;
}

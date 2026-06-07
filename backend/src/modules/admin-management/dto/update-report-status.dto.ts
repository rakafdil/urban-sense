import { IsEnum } from 'class-validator';
import { ReportStatus } from '../enum/report-status.enum';

export class UpdateReportStatusDto {
    @IsEnum(ReportStatus)
    status: ReportStatus = ReportStatus.OPEN;
}
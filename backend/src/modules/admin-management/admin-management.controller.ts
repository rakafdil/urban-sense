import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query
} from '@nestjs/common';
import { AdminManagementService } from './admin-management.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportQueryDto } from './dto/report-query.dto';

@Controller('admin')
export class AdminManagementController {
    constructor(
        private readonly adminService: AdminManagementService,
    ) { }

    @Get('reports')
    getReports(@Query() query?: ReportQueryDto) {  // terima query opsional
        return this.adminService.getAllReports(query || {});
    }

    @Get('reports/:id')
    getReportById(
        @Param('id') id: string,
    ) {
        return this.adminService.getReportById(
            id,
        );
    }

    @Patch('reports/:id/status')
    updateStatus(
        @Param('id') reportId: string,
        @Body() dto: UpdateReportStatusDto,
    ) {
        return this.adminService.updateStatus(
            reportId,
            dto.status,

            // sementara hardcoded
            'admin-id',
        );
    }

    @Get('dashboard')
    dashboard() {
        return this.adminService.dashboard();
    }

    @Get('analytics')
    analytics() {
        return this.adminService.analytics();
    }

    @Get('analytics/districts')
    async getDistrictAnalytics() {
        return this.adminService.districtAnalytics();
    }
}
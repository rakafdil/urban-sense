import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportStatus } from '@prisma/client';
import { ReportQueryDto } from './dto/report-query.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto'
import { AnalyticsResponseDto } from './dto/analytics-response.dto'

@Injectable()
export class AdminManagementService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getAllReports(
        query: ReportQueryDto = {},
    ) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);

        return this.prisma.report.findMany({
            where: {
                ...(query.status && {
                    status: query.status as any,
                }),

                ...(query.category && {
                    category: query.category as any,
                }),
            },

            skip: (page - 1) * limit,

            take: limit,

            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getReportById(id: string) {
        const report =
            await this.prisma.report.findUnique({
                where: {
                    id,
                },
                include: {
                    user: true,
                    statusLogs: true,
                },
            });

        if (!report) {
            throw new NotFoundException(
                'Report not found',
            );
        }

        return report;
    }

    async updateStatus(
        reportId: string,
        status: ReportStatus,
        adminId: string,
    ) {
        const report =
            await this.prisma.report.findUnique({
                where: {
                    id: reportId,
                },
            });

        if (!report) {
            throw new NotFoundException(
                'Report not found',
            );
        }

        const updatedReport =
            await this.prisma.report.update({
                where: {
                    id: reportId,
                },
                data: {
                    status,
                },
            });

        await this.prisma.reportStatusLog.create({
            data: {
                reportId,
                updatedBy: adminId,
                oldStatus: report.status,
                newStatus: status,
            },
        });

        return updatedReport;
    }

    async dashboard(): Promise<DashboardResponseDto> {
        const [
            totalReports,
            openReports,
            inProgressReports,
            resolvedReports,
            rejectedReports,
        ] = await Promise.all([
            this.prisma.report.count(),

            this.prisma.report.count({
                where: {
                    status: 'open',
                },
            }),

            this.prisma.report.count({
                where: {
                    status: 'in_progress',
                },
            }),

            this.prisma.report.count({
                where: {
                    status: 'resolved',
                },
            }),

            this.prisma.report.count({
                where: {
                    status: 'rejected',
                },
            }),
        ]);

        return {
            totalReports,
            openReports,
            inProgressReports,
            resolvedReports,
            rejectedReports,
        };
    }

    async analytics(): Promise<
        AnalyticsResponseDto[]
    > {
        const grouped =
            await this.prisma.report.groupBy({
                by: ['category'],
                _count: {
                    category: true,
                },
            });

        return grouped.map((item) => ({
            category: item.category,
            total: item._count.category,
        }));
    }

    async districtAnalytics() {
        return this.prisma.district.findMany({
            include: {
                _count: {
                    select: { reports: true },
                },
            },
            orderBy: {
                reports: { _count: 'desc' },
            },
            take: 5,
        });
    }
}
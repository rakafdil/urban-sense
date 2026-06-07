import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HaversineUtil } from './utils/haversine.util';

@Injectable()
export class GeospatialService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getHeatmap(
        category?: string,
        status?: string,
    ) {
        const reports =
            await this.prisma.report.findMany({
                where: {
                    ...(category && {
                        category: category as any,
                    }),

                    ...(status && {
                        status: status as any,
                    }),
                },

                select: {
                    id: true,
                    latitude: true,
                    longitude: true,
                    category: true,
                    status: true,
                },
            });

        return reports.map((report) => ({
            lat: Number(report.latitude),
            lng: Number(report.longitude),
            weight: 1,
            category: report.category,
            status: report.status,
        }));
    }

    async findNearestVolunteers(
        latitude: number,
        longitude: number,
        radiusKm: number,
    ) {
        const volunteers =
            await this.prisma.user.findMany({
                where: {
                    role: 'volunteer',
                },
            });

        return volunteers
            .map((volunteer) => {
                const distance =
                    HaversineUtil.calculateDistance(
                        latitude,
                        longitude,
                        Number(volunteer.latitude),
                        Number(volunteer.longitude),
                    );

                return {
                    ...volunteer,
                    distanceKm: Number(
                        distance.toFixed(2),
                    ),
                };
            })
            .filter(
                (volunteer) =>
                    volunteer.distanceKm <= radiusKm,
            )
            .sort(
                (a, b) =>
                    a.distanceKm - b.distanceKm,
            );
    }

    async getReportsInRadius(
        latitude: number,
        longitude: number,
        radiusKm: number,
    ) {
        const reports =
            await this.prisma.report.findMany();

        return reports.filter((report) => {
            const distance =
                HaversineUtil.calculateDistance(
                    latitude,
                    longitude,
                    Number(report.latitude),
                    Number(report.longitude),
                );

            return distance <= radiusKm;
        });
    }

    async getHotspots() {
        const reports =
            await this.prisma.report.findMany({
                select: {
                    address: true,
                },
            });

        const hotspotMap = new Map<
            string,
            number
        >();

        reports.forEach((report) => {
            const key =
                report.address || 'Unknown';

            hotspotMap.set(
                key,
                (hotspotMap.get(key) || 0) + 1,
            );
        });

        return [...hotspotMap.entries()]
            .map(([location, total]) => ({
                location,
                total,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
    }
}
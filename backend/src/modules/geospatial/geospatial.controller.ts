import {
    Body,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { GeospatialService } from './geospatial.service';
import { HeatmapQueryDto } from './dto/heatmap-query.dto';
import { NearestVolunteerDto } from './dto/nearest-volunteer.dto';
import { RadiusQueryDto } from './dto/radius-query.dto';

@Controller('geospatial')
export class GeospatialController {
    constructor(
        private readonly geospatialService: GeospatialService,
    ) { }

    @Get('heatmap')
    getHeatmap(
        @Query() query: HeatmapQueryDto,
    ) {
        return this.geospatialService.getHeatmap(
            query.category,
            query.status,
        );
    }

    @Post('nearest-volunteer')
    findNearestVolunteer(
        @Body()
        dto: NearestVolunteerDto,
    ) {
        return this.geospatialService
            .findNearestVolunteers(
                dto.latitude,
                dto.longitude,
                dto.radiusKm,
            );
    }

    @Post('reports-in-radius')
    getReportsInRadius(
        @Body() dto: RadiusQueryDto,
    ) {
        return this.geospatialService
            .getReportsInRadius(
                dto.latitude,
                dto.longitude,
                dto.radiusKm,
            );
    }

    @Get('hotspots')
    getHotspots() {
        return this.geospatialService
            .getHotspots();
    }
}
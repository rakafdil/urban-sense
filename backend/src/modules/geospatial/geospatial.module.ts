import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GeospatialController } from './geospatial.controller';
import { GeospatialService } from './geospatial.service';

@Module({
    imports: [PrismaModule],
    controllers: [GeospatialController],
    providers: [GeospatialService],
    exports: [GeospatialService],
})
export class GeospatialModule { }
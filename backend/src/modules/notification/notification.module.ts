import { Module } from '@nestjs/common';
import { PrismaModule }
    from '../prisma/prisma.module';
import { GeospatialModule }
    from '../geospatial/geospatial.module';
import { NotificationController }
    from './notification.controller';
import { NotificationService }
    from './notification.service';

@Module({
    imports: [
        PrismaModule,
        GeospatialModule,
    ],
    controllers: [
        NotificationController,
    ],
    providers: [
        NotificationService,
    ],
    exports: [
        NotificationService,
    ],
})
export class NotificationModule { }
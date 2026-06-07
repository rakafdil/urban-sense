import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './modules/users/users.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ReportModule } from './modules/report/report.module.js';
import { AdminManagementModule } from './modules/admin-management/admin-management.module.js';
import { VolunteerValidationModule } from './modules/volunteer-validation/volunteer-validation.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ReportModule,
    AdminManagementModule,
    VolunteerValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

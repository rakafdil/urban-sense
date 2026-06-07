import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const connectionString = isProduction
      ? process.env.DATABASE_URL_NEON
      : process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        isProduction
          ? 'DATABASE_URL_NEON is not defined'
          : 'DATABASE_URL is not defined',
      );
    }

    try {
      const dbHost = new URL(connectionString).host;
      // Log which database target is used without exposing credentials.
      console.log('[DB] using', isProduction ? 'NEON' : 'LOCAL', dbHost);
    } catch {
      console.warn('[DB] invalid database URL');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  cleanDatabase() {
    // Order matters: delete child records first (foreign keys)
    return this.$transaction([
      this.reportStatusLog.deleteMany(),
      this.reportValidation.deleteMany(),
      this.reportDistrict.deleteMany(),
      this.notification.deleteMany(),
      this.report.deleteMany(),
      this.user.deleteMany(),
      // District may be referenced by ReportDistrict, so delete after or keep as reference data
      this.district.deleteMany(),
    ]);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto.js';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { Prisma, Task } from '@prisma/client';


@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
}

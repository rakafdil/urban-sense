import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportService } from './report.service.js';
import {
  CreateReportDto,
  UpdateReportDto,
} from './dto/report.dto.js';
import { JwtGuard } from '../auth/guard/jwt.guard.js';
import { GetUser } from '../auth/decorator/get-user.decorator.js';

@ApiTags('report')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}

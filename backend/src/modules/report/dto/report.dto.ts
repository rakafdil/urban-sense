import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  IsArray,
  IsIn,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportDto {
}

export class UpdateReportDto {
}

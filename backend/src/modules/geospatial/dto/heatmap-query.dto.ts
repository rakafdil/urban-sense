import {
    IsOptional,
    IsString,
} from 'class-validator';

export class HeatmapQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
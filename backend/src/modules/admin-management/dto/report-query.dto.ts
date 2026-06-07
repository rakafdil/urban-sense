import {
    IsOptional,
    IsString,
    IsNumberString,
} from 'class-validator';

export class ReportQueryDto {
    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumberString()
    page?: string = '1';

    @IsOptional()
    @IsNumberString()
    limit?: string = '10';
}
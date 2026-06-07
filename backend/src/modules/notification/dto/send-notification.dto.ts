import {
    IsOptional,
    IsString,
} from 'class-validator';

export class SendNotificationDto {

    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsOptional()
    @IsString()
    role?: string;
}
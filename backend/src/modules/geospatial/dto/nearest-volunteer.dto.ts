import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    Min,
} from 'class-validator';

export class NearestVolunteerDto {
    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;

    @IsNumber()
    @Min(1)
    radiusKm: number;
}
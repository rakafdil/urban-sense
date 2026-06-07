import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum ReportCategory {
  ROAD_DAMAGE = 'road_damage',
  FLOOD = 'flood',
  GARBAGE = 'garbage',
  STREET_LIGHT = 'street_light',
  DRAINAGE = 'drainage',
  SOCIAL_ASSISTANCE = 'social_assistance',
  ENVIRONMENT = 'environment',
  OTHER = 'other',
}

export class CreateReportDto {
  @IsString({ message: 'Judul harus berupa teks.' })
  @IsNotEmpty({ message: 'Judul laporan tidak boleh kosong.' })
  @MinLength(5, { message: 'Judul laporan minimal 5 karakter.' })
  @MaxLength(100, { message: 'Judul laporan maksimal 100 karakter.' })
  title!: string;

  @IsString({ message: 'Deskripsi harus berupa teks.' })
  @IsNotEmpty({ message: 'Deskripsi laporan tidak boleh kosong.' })
  @MinLength(10, {
    message: 'Deskripsi minimal 10 karakter untuk memperjelas masalah.',
  })
  description!: string;

  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Kategori laporan tidak valid.' })
  category?: ReportCategory;

  @IsOptional()
  @IsNumberString({}, { message: 'Latitude harus berupa format angka.' })
  latitude?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Longitude harus berupa format angka.' })
  longitude?: string;

  @IsOptional()
  @IsString({ message: 'Alamat harus berupa teks.' })
  address?: string;
}

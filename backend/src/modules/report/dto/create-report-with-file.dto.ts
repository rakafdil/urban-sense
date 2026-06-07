import { ApiProperty } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';

export class CreateReportWithFileDto extends CreateReportDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  photo!: any;
}

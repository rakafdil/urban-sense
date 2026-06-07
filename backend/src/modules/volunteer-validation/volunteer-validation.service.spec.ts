import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerValidationService } from './volunteer-validation.service';

describe('VolunteerValidationService', () => {
  let service: VolunteerValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VolunteerValidationService],
    }).compile();

    service = module.get<VolunteerValidationService>(VolunteerValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

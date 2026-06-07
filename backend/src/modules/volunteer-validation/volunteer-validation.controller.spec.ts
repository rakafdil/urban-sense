import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerValidationController } from './volunteer-validation.controller';

describe('VolunteerValidationController', () => {
  let controller: VolunteerValidationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerValidationController],
    }).compile();

    controller = module.get<VolunteerValidationController>(VolunteerValidationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

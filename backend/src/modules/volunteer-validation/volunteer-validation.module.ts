import { Module } from '@nestjs/common';
import { GamificationService } from '../../services/gamification.service';
import { VolunteerController } from './volunteer-validation.controller';
import { VolunteerService } from './volunteer-validation.service';

@Module({
  controllers: [VolunteerController],
  providers: [VolunteerService, GamificationService],
})
export class VolunteerValidationModule {}

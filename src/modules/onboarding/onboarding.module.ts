import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  controllers: [OnboardingController],
  imports: [TypeOrmModule.forFeature([Onboarding])],
  providers: [OnboardingService, S3Service],
})
export class OnboardingModule {}

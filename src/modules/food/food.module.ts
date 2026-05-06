import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { MealController } from './food.controller';
import { Meal } from './entities/meal.entity';
import { MealService } from './food.service';
import { MealRepository } from './repositories/meal.repository';

@Module({
  controllers: [MealController],
  imports: [TypeOrmModule.forFeature([Meal])],
  providers: [MealService, MealRepository, S3Service],
  exports: [MealService, MealRepository],
})
export class MealModule {}

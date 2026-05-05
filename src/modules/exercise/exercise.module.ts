import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise } from './entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExerciseController],
  providers: [ExerciseService, S3Service],
})
export class ExerciseModule {}

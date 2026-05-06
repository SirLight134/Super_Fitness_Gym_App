import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  ExerciseCategory,
  ExerciseLevel,
  ExerciseSubCategory,
} from '../exercise.enums';

export class ExerciseFilterDto {
  @ApiPropertyOptional({ enum: ExerciseCategory })
  @IsOptional()
  @IsEnum(ExerciseCategory)
  category?: ExerciseCategory;

  @ApiPropertyOptional({ enum: ExerciseSubCategory })
  @IsOptional()
  @IsEnum(ExerciseSubCategory)
  subCategory?: ExerciseSubCategory;

  @ApiPropertyOptional({ enum: ExerciseLevel })
  @IsOptional()
  @IsEnum(ExerciseLevel)
  level?: ExerciseLevel;
}

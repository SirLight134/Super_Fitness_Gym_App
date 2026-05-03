import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import {
  ExerciseCategory,
  ExerciseLevel,
  ExerciseSubCategory,
} from '../exercise.enums';

export class CreateExerciseDto {
  @ApiProperty({ enum: ExerciseCategory })
  @IsEnum(ExerciseCategory)
  category!: ExerciseCategory;

  @ApiProperty({ enum: ExerciseSubCategory })
  @IsEnum(ExerciseSubCategory)
  subCategory!: ExerciseSubCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsUrl()
  videoUrl!: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The exercise image file',
  })
  image: any;

  @ApiProperty({ enum: ExerciseLevel })
  @IsEnum(ExerciseLevel)
  level!: ExerciseLevel;
}

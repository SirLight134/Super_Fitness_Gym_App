import { Category, Ingredient } from '@/common/enums/food.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMealDto {
  @ApiProperty({
    example: 'breakfast',
    description: 'The category of the meal',
    enum: Category,
  })
  category?: Category;

  @ApiProperty({
    example: 'Pasta with meat',
    description: 'Name of the meal',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  title!: string;

  @ApiProperty({
    example: 'Delicious pasta with rich meat sauce',
    description: 'Description of the meal',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    description: 'URL of the video',
  })
  video!: string;

  @ApiProperty({
    example: [
      { name: 'Pasta', weight: 200 },
      { name: 'Meat', weight: 150 },
    ],
    description: 'The ingredients of the meal',
  })
  @IsNotEmpty()
  @IsArray()
  ingredients!: Ingredient[];
}

export class UpdateMealDto extends PartialType(CreateMealDto) {}

export class MealResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  category?: Category;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  video!: string;

  @ApiProperty()
  ingredients!: Ingredient[];
}

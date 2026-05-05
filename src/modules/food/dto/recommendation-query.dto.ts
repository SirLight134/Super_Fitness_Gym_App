import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '../entities/food.entity';

export class RecommendationQueryDto {
  @ApiProperty({ enum: MealType, example: MealType.BREAKFAST })
  mealType!: MealType;
}

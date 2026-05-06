import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '../entities/food.entity';

export class UpdateFoodDto {
  @ApiProperty({ example: 'Granola' })
  name!: string;

  @ApiProperty({ example: 200 })
  calories!: number;

  @ApiProperty({ enum: MealType, example: MealType.LUNCH })
  mealType!: MealType;
}

import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '../entities/food.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateFoodDto {
  @ApiProperty({ example: 'Oatmeal' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  calories!: number;

  @ApiProperty({ enum: MealType, example: MealType.BREAKFAST })
  @IsEnum(MealType)
  @IsNotEmpty()
  mealType!: MealType;
}

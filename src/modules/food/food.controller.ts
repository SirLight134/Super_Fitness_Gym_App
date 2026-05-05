import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { Public } from '../Auth/decorators/public.decorator';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';

@Public()
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  async createFood(@Body() body: CreateFoodDto) {
    const { name, calories, mealType } = body;
    return this.foodService.createFood(name, calories, mealType);
  }

  @Get()
  async findAll() {
    return this.foodService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.foodService.findById(id);
  }

  @Put(':id')
  async updateFood(@Param('id') id: number, @Body() body: UpdateFoodDto) {
    const { name, calories, mealType } = body;
    return this.foodService.updateFood(id, name, calories, mealType);
  }

  @Get('recommendations')
  async findByMealType(@Query() query: RecommendationQueryDto) {
    return this.foodService.findByMealType(query.mealType);
  }

  @Delete(':id')
  async deleteFood(@Param('id') id: number) {
    return this.foodService.deleteFood(id);
  }
}

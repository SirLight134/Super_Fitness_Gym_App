import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Food, MealType } from './entities/food.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async createFood(name: string, calories: number, mealType: MealType) {
    const food = this.foodRepository.create({
      name,
      calories,
      mealType,
    });
    return this.foodRepository.save(food);
  }

  async findAll() {
    return this.foodRepository.find();
  }

  async findById(id: number) {
    return this.foodRepository.findOne({ where: { id } });
  }

  async findByMealType(mealType: MealType) {
    return this.foodRepository.find({ where: { mealType } });
  }

  async updateFood(
    id: number,
    name: string,
    calories: number,
    mealType: MealType,
  ) {
    const food = await this.findById(id);
    if (!food) {
      return null;
    }
    food.name = name;
    food.calories = calories;
    food.mealType = mealType;
    return this.foodRepository.save(food);
  }

  async deleteFood(id: number) {
    const food = await this.findById(id);
    if (!food) {
      return null;
    }
    return this.foodRepository.delete({ id });
  }
}

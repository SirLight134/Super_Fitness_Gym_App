import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Meal } from '../entities/meal.entity';
import { Category } from '@/common/enums/food.enum';

@Injectable()
export class MealRepository {
  constructor(
    @InjectRepository(Meal)
    private readonly repository: Repository<Meal>,
  ) {}

  /**
   * Create a new meal
   */
  async create(mealData: Partial<Meal>): Promise<Meal> {
    const meal = this.repository.create(mealData);
    return this.repository.save(meal);
  }

  /**
   * Find a meal by ID
   */
  async findById(id: string): Promise<Meal | null> {
    return this.repository.findOneBy({ id: parseInt(id) });
  }

  /**
   * Find a meal by category
   */
  async findByCategory(
    category: Category,
    options?: { page?: number; limit?: number },
  ): Promise<Meal[]> {
    return this.repository.find({
      where: { category },
      skip: options?.page,
      take: options?.limit,
    });
  }

  /**
   * Update a meal
   */
  async update(id: string, mealData: Partial<Meal>): Promise<Meal | null> {
    await this.repository.update(id, mealData);
    return this.findById(id);
  }

  /**
   * Delete a meal from database
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Find meals with pagination
   */
  async findWithPagination(options: {
    page: number;
    limit: number;
  }): Promise<{ data: Meal[]; total: number; page: number; limit: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Meal> = {};

    const [data, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

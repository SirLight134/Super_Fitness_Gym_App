import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MealRepository } from './repositories/meal.repository';
import { Meal } from './entities/meal.entity';
import { CreateMealDto, UpdateMealDto } from './dto/createMeal.dto';
import { S3Service } from '@/s3/s3.service';
import { Category } from '@/common/enums/food.enum';

@Injectable()
export class MealService {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Create a new meal
   */
  async create(
    createMealDto: CreateMealDto,
    file: Express.Multer.File,
  ): Promise<Meal> {
    // check video file
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    // upload video and get URL
    const videoUrl = await this.s3Service.uploadVideo(file);

    // create meal with video URL
    const meal = await this.mealRepository.create({
      ...createMealDto,
      video: videoUrl,
    });

    return meal;
  }

  /**
   * Find all meals with pagination
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: Meal[]; total: number; page: number; limit: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    return this.mealRepository.findWithPagination({
      page,
      limit,
    });
  }

  /**
   * Find all meals by category
   */
  async findByCategory(
    category: Category,
    options?: { page?: number; limit?: number },
  ): Promise<Meal[]> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    return this.mealRepository.findByCategory(category, { page, limit });
  }

  /**
   * Find a meal by ID
   */
  async findOne(id: string): Promise<Meal> {
    const meal = await this.mealRepository.findById(id);

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return meal;
  }

  /**
   * Update a meal
   */
  async update(
    id: string,
    updateMealDto: UpdateMealDto,
    file?: Express.Multer.File,
  ): Promise<Meal | null> {
    const meal = await this.mealRepository.findById(id);

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    Object.assign(meal, updateMealDto);

    if (file) {
      meal.video = await this.s3Service.uploadVideo(file);
    }

    return this.mealRepository.update(id, meal);
  }

  /**
   * Delete a meal
   */
  async delete(id: string): Promise<void> {
    const meal = await this.mealRepository.findById(id);

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    const deleted = await this.mealRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('Failed to delete meal');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseFilterDto } from './dto/exercise-filter.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import {
  EXERCISE_SUBCATEGORIES_BY_CATEGORY,
  isSubCategoryAllowedForCategory,
} from './exercise.enums';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly repo: Repository<Exercise>,
    private readonly s3Service: S3Service,
  ) {}

  getCategories() {
    return Object.entries(EXERCISE_SUBCATEGORIES_BY_CATEGORY).map(
      ([category, subCategories]) => ({
        category,
        subCategories,
      }),
    );
  }

  private assertCategoryMatchesSubCategory(dto: {
    category?: Exercise['category'];
    subCategory?: Exercise['subCategory'];
  }) {
    if (!dto.category || !dto.subCategory) return;
    if (!isSubCategoryAllowedForCategory(dto.category, dto.subCategory)) {
      throw new BadRequestException(
        `subCategory '${dto.subCategory}' is not valid for category '${dto.category}'`,
      );
    }
  }

  async create(dto: CreateExerciseDto, file?: Express.Multer.File) {
    this.assertCategoryMatchesSubCategory(dto);

    const imageUrl = file ? await this.s3Service.uploadFile(file) : undefined;
    const exercise = this.repo.create({ ...dto, image: imageUrl });
    return this.repo.save(exercise);
  }

  async findAll(filter: ExerciseFilterDto) {
    const where: Partial<Pick<Exercise, 'category' | 'level' | 'subCategory'>> =
      {};

    if (filter.category) where.category = filter.category;
    if (filter.level) where.level = filter.level;
    if (filter.subCategory) where.subCategory = filter.subCategory;

    return this.repo.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const exercise = await this.repo.findOneBy({ id });
    if (!exercise)
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    return exercise;
  }

  async update(id: number, dto: UpdateExerciseDto, file?: Express.Multer.File) {
    const exercise = await this.findOne(id);

    const merged = { ...exercise, ...dto } as Exercise;
    this.assertCategoryMatchesSubCategory({
      category: merged.category,
      subCategory: merged.subCategory,
    });

    Object.assign(exercise, dto);

    if (file) {
      exercise.image = await this.s3Service.uploadFile(file);
    }

    return this.repo.save(exercise);
  }

  async remove(id: number) {
    const exercise = await this.findOne(id);
    await this.repo.remove(exercise);
    return { message: 'Deleted successfully' };
  }
}

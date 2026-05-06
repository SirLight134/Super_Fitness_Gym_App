import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Repository } from 'typeorm';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { Onboarding } from './entities/onboarding.entity';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private readonly repo: Repository<Onboarding>,
    private readonly s3Service: S3Service,
  ) {}

  async create(dto: CreateOnboardingDto, file: Express.Multer.File) {
    if (!file) throw new Error('Image is required');

    const imageUrl = await this.s3Service.uploadImage(file);

    const screen = this.repo.create({ ...dto, image: imageUrl });

    return await this.repo.save(screen);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const screen = await this.repo.findOneBy({ id });
    if (!screen) throw new NotFoundException(`Screen with ID ${id} not found`);
    return screen;
  }

  async update(
    id: number,
    dto: UpdateOnboardingDto,
    file?: Express.Multer.File,
  ) {
    const screen = await this.findOne(id);

    Object.assign(screen, dto);

    if (file) {
      screen.image = await this.s3Service.uploadImage(file);
    }

    return await this.repo.save(screen);
  }

  async remove(id: number) {
    const screen = await this.findOne(id);
    await this.repo.remove(screen);
    return { message: 'Deleted successfully' };
  }
}

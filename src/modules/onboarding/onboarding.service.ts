import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../../s3/s3.service';
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

    const imageUrl = await this.s3Service.uploadFile(file);

    const data = { ...dto } as Record<string, unknown>;
    delete data.image;

    const screen = this.repo.create({
      ...(data as any),
      image: imageUrl,
    });

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

    if (file) {
      screen.image = await this.s3Service.uploadFile(file);
    }

    const data = { ...dto } as Record<string, unknown>;
    delete data.image;

    const screenAsRecord = screen as unknown as Record<string, unknown>;

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== '') {
        screenAsRecord[key] = value;
      }
    });

    await this.repo.save(screen);
    return this.findOne(id);
  }

  async remove(id: number) {
    const screen = await this.findOne(id);
    await this.repo.remove(screen);
    return { message: 'Deleted successfully' };
  }
}

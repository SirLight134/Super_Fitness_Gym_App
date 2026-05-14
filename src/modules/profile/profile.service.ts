import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { S3Service } from '../../s3/s3.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'gender',
        'phoneNumber',
        'weight',
        'height',
        'goal',
        'activityLevel',
        'profilePictureUrl',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle file upload if provided
    if (file) {
      user.profilePictureUrl = await this.s3Service.uploadImage(file);
    } else if (updateProfileDto.profilePictureUrl) {
      // Also allow manual URL update if needed (or ignore if file takes precedence)
      user.profilePictureUrl = updateProfileDto.profilePictureUrl;
    }

    if (updateProfileDto.firstName) user.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName) user.lastName = updateProfileDto.lastName;
    if (updateProfileDto.gender) user.gender = updateProfileDto.gender;
    if (updateProfileDto.phoneNumber)
      user.phoneNumber = updateProfileDto.phoneNumber;
    if (updateProfileDto.weight) user.weight = updateProfileDto.weight;
    if (updateProfileDto.height) user.height = updateProfileDto.height;
    if (updateProfileDto.goal) user.goal = updateProfileDto.goal;
    if (updateProfileDto.activityLevel)
      user.activityLevel = updateProfileDto.activityLevel;

    return await this.userRepository.save(user);
  }
}

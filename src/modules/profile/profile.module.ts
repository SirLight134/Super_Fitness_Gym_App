import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { S3Service } from '../../s3/s3.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ProfileController],
  imports: [TypeOrmModule.forFeature([User]), MulterModule.register()],
  providers: [ProfileService, S3Service],
})
export class ProfileModule {}

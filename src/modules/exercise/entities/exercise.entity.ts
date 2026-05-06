import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ExerciseCategory,
  ExerciseLevel,
  ExerciseSubCategory,
} from '../exercise.enums';

@Entity('exercises')
export class Exercise {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ enum: ExerciseCategory })
  @Column({ type: 'enum', enum: ExerciseCategory })
  category!: ExerciseCategory;

  @ApiProperty({ enum: ExerciseSubCategory })
  @Column({ type: 'enum', enum: ExerciseSubCategory })
  subCategory!: ExerciseSubCategory;

  @ApiProperty()
  @Column()
  title!: string;

  @ApiProperty()
  @Column()
  description!: string;

  @ApiProperty()
  @Column()
  videoUrl!: string;

  @ApiProperty({ description: 'Image URL (uploaded to S3)' })
  @Column()
  image!: string;

  @ApiProperty({ enum: ExerciseLevel })
  @Column({ type: 'enum', enum: ExerciseLevel })
  level!: ExerciseLevel;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

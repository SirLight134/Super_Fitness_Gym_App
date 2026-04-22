import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('onboarding')
export class Onboarding {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  title!: string;

  @ApiProperty()
  @Column()
  subtitle!: string;

  @ApiProperty()
  @Column()
  image!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

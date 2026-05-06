import { Category, Ingredient } from '@/common/enums/food.enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: Category,
    nullable: true,
    default: Category.BREAKFAST,
  })
  category?: Category;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  video!: string;

  @Column('jsonb')
  ingredients!: Ingredient[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

@Entity('food')
export class Food {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  calories!: number;

  @Column({
    type: 'enum',
    enum: MealType,
  })
  mealType!: MealType;
}

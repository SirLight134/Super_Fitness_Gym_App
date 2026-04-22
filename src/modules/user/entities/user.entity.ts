import { ActivityLevel, Gender, Goal } from 'src/common/enums/user.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  @Index()
  email!: string;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ select: false }) // Don't include password in default queries
  password!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ nullable: true, length: 20 })
  phoneNumber?: string;

  // Complete register fields
  @Column({ type: 'int', nullable: true })
  weight?: number;

  @Column({ nullable: true, type: 'int' })
  height?: number;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'enum', enum: Goal, nullable: true })
  goal?: Goal;

  @Column({
    type: 'enum',
    enum: ActivityLevel,
    nullable: true,
    default: ActivityLevel.BEGINNER,
  })
  activityLevel?: ActivityLevel;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true })
  emailVerifiedAt?: Date;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

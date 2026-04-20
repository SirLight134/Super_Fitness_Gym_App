import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Match } from 'src/common/decorators/match.decorator';
import { ActivityLevel, Gender, Goal } from 'src/common/enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'ahmed' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'ali' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'ahmed@domain.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirm password (must match the password field)',
  })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsOptional()
  @IsPhoneNumber('EG')
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 90, maximum: 500 })
  @IsOptional()
  @IsInt()
  @Max(500)
  weight?: number;

  @ApiPropertyOptional({ example: 170, maximum: 250 })
  @IsOptional()
  @IsInt()
  @Max(250)
  height?: number;

  @ApiPropertyOptional({ enum: Goal })
  @IsOptional()
  @IsEnum(Goal)
  goal?: Goal;

  @ApiPropertyOptional({ enum: ActivityLevel, default: ActivityLevel.BEGINNER })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// user response dto
export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  gender!: 'male' | 'female';

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  goal?: Goal;

  @ApiPropertyOptional()
  activityLevel?: ActivityLevel;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

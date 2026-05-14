import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUrl,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { Gender, Goal, ActivityLevel } from 'src/common/enums/user.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 75 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ enum: Goal })
  @IsEnum(Goal)
  @IsOptional()
  goal?: Goal;

  @ApiPropertyOptional({ enum: ActivityLevel })
  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file',
  })
  @IsOptional()
  profilePicture?: any;
}

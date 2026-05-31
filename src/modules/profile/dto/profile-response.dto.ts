import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityLevel, Gender, Goal } from 'src/common/enums/user.enum';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  gender!: Gender;

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
  profilePictureUrl?: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

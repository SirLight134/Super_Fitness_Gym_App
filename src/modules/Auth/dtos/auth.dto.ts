import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from 'src/common/decorators/match.decorator';
import { Gender } from 'src/common/enums/user.enum';
import { UserResponseDto } from 'src/modules/user/dto/user.dto';

export class RegisterDto {
  @ApiProperty({ example: 'ahmed' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'ali' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'ahmed@domain.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirm password (must match the password field)',
  })
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsOptional()
  @IsPhoneNumber('EG')
  phoneNumber?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  user!: UserResponseDto;
}

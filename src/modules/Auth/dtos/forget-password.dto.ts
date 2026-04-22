import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/common/decorators/match.decorator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code',
  })
  @IsString()
  @IsNotEmpty()
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code',
  })
  @IsString()
  @IsNotEmpty()
  otp!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'New user password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Confirm new password (must match the newPassword field)',
  })
  @IsNotEmpty()
  @IsString()
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword!: string;
}

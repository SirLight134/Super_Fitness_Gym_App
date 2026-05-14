import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateEmailChangeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;
}

export class VerifyEmailChangeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be 6 digits' })
  otp!: string;
}

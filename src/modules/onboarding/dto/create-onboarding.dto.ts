import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOnboardingDto {
  @ApiProperty({
    example: 'Welcome to Super Fitness',
    description: 'The title of the screen',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @ApiProperty({
    example: 'Start your journey today',
    description: 'The subtitle of the screen',
  })
  @IsString()
  @IsNotEmpty()
  subtitle!: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Onboarding image file',
  })
  @IsOptional()
  image?: any;
}

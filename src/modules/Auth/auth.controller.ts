import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import {
  AuthResponseDto,
  LoginDto,
  loginResponseDto,
  RegisterDto,
} from './dtos/auth.dto';
import { CompleteRegisterDto } from './dtos/complete-register.dto';

@ApiTags('Authentication')
@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  // login

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: loginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<loginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Patch('complete-profile')
  @ApiOperation({ summary: 'Update user profile steps (Onboarding)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async completeProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CompleteRegisterDto,
  ) {
    return this.authService.completeProfile(user.id, dto);
  }
}

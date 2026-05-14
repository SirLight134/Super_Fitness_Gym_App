import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, AuthResponseDto, LoginDto } from './dtos/auth.dto';
import {
  type AuthenticatedUser,
  CurrentUser,
} from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dtos/forget-password.dto';
import {
  InitiateEmailChangeDto,
  VerifyEmailChangeDto,
} from './dtos/update-email.dto';

@ApiTags('Authentication')
@ApiBearerAuth('JWT-auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // exclude password from response
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

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('initiate-email-change')
  async initiateEmailChange(
    @Body() initiateEmailChangeDto: InitiateEmailChangeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.authService.initiateEmailChange(
      user.id,
      initiateEmailChangeDto.newEmail,
    );
  }

  @Post('verify-email-change')
  async verifyEmailChange(
    @Body() verifyEmailChangeDto: VerifyEmailChangeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.authService.verifyEmailChange(
      user.id,
      verifyEmailChangeDto.newEmail,
      verifyEmailChangeDto.otp,
    );
  }
}

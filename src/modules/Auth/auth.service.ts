import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repositories/user.repository';
import { RegisterDto, AuthResponseDto, LoginDto } from './dtos/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dtos/forget-password.dto';
import { MailService } from 'src/common/mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if email already exists
    const existingUser = await this.userRepository.emailExists(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const user = await this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
      user,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user with password
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is deactivated. Contact support.',
      );
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
      user,
    };
  }

  /**
   * Validate user (used by JWT strategy)
   */
  async validateUser(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
    };
  }

  /**
   * Forgot password
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return {
        message: 'If your email is registered, you will receive an OTP',
      };
    }

    // Check if user is active
    if (!user.isActive) {
      throw new BadRequestException('Account is deactivated. Contact support.');
    }

    // Generate OTP
    return this.generateOtp(email);
  }

  // generate otp service
  async generateOtp(email: string): Promise<{ message: string }> {
    const existing = await this.otpRepository.findOne({
      where: {
        email,
        is_valid: true,
        expires_at: MoreThan(new Date()),
      },
    });

    if (existing) {
      throw new BadRequestException('OTP already sent. Try again later.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otp = this.otpRepository.create({
      email,
      code,
      expires_at: expiresAt,
    });

    await this.otpRepository.save(otp);

    await this.mailService.sendOtpEmail(email, code);

    return { message: 'OTP sent successfully' };
  }

  // verify otp service
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otp: code } = verifyOtpDto;

    const otpRecord = await this.otpRepository.findOne({
      where: { email, code, is_valid: true },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }
    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    otpRecord.is_valid = false;
    await this.otpRepository.save(otpRecord);

    return { message: 'OTP verified successfully' };
  }

  /**
   * Reset password after OTP verification
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1- compare current password
    const isPasswordValid = await this.comparePasswords(
      resetPasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // 2- check if the new password is the same as the current password
    const isSamePassword = await this.comparePasswords(
      resetPasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be the same as the current password',
      );
    }

    // 3- Hash new password
    const hashedPassword = await this.hashPassword(
      resetPasswordDto.newPassword,
    );

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    return {
      message:
        'Password reset successfully. Please login with your new password.',
    };
  }

  // initiate email change service
  async initiateEmailChange(
    userId: string,
    newEmail: string,
  ): Promise<{ message: string }> {
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.email === newEmail) {
      throw new BadRequestException(
        'New email cannot be the same as the current email',
      );
    }

    const emailExists = await this.userRepository.emailExists(newEmail);
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    // Generate and send OTP to the new email
    return this.generateOtp(newEmail);
  }

  // verify email change service
  async verifyEmailChange(
    userId: string,
    newEmail: string,
    otp: string,
  ): Promise<{ message: string }> {
    // Verify OTP for the new email
    await this.verifyOtp({ email: newEmail, otp });

    // Update user email
    await this.userRepository.update(userId, { email: newEmail });

    return { message: 'Email changed successfully' };
  }

  // ─── Private Helper Methods ──────────────────────────────────────────────

  private generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!plainPassword || !hashedPassword) {
      throw new BadRequestException('Invalid passwords data');
    }
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

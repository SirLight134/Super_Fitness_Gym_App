import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repositories/user.repository';
import {
  AuthResponseDto,
  LoginDto,
  loginResponseDto,
  RegisterDto,
} from './dtos/auth.dto';
import { CompleteRegisterDto } from './dtos/complete-register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // login =================================

  async login(loginDto: LoginDto): Promise<loginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.comparePasswords(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
    };
  }

  async completeProfile(userId: string, dto: CompleteRegisterDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return await this.userRepository.update(userId, dto);
  }

  // private async comparePasswords(
  //   plainPassword: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   return bcrypt.compare(plainPassword, hashedPassword);
  // }
}

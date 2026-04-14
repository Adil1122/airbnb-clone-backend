import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(registerDto: RegisterDto): Promise<{ message: string; email: string; needsVerification: boolean }> {
    const { name, email, password } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        await this.sendVerificationEmail(existingUser);
        return {
          message: 'An unverified account exists with this email. A new verification email has been sent.',
          email,
          needsVerification: true
        };
      }
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      verificationSentAt: new Date(),
    });

    await this.usersRepository.save(user);

    await this.sendVerificationEmail(user);

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      email,
      needsVerification: true
    };
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${user.emailVerificationToken}&email=${user.email}`;
    
    console.log('\n========================================');
    console.log('📧 EMAIL VERIFICATION (Localhost)');
    console.log('========================================');
    console.log(`To: ${user.email}`);
    console.log(`Subject: Verify your Airbnb account`);
    console.log(`\nClick this link to verify:`);
    console.log(`${verificationUrl}`);
    console.log('========================================\n');
  }

  async verifyEmail(token: string, email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired verification link. Please request a new one.',
      };
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null as unknown as string | null;
    user.emailVerificationExpires = null as unknown as Date | null;
    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'Email verified successfully! You can now login.',
    };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return {
        message: 'If an account exists with this email, a verification link has been sent.',
      };
    }

    if (user.isEmailVerified) {
      return {
        message: 'This email is already verified. You can login.',
      };
    }

    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    user.verificationSentAt = new Date();
    await this.usersRepository.save(user);

    await this.sendVerificationEmail(user);

    return {
      message: 'Verification email has been sent. Please check your email.',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async getProfile(userId: number): Promise<{ id: number; name: string; email: string; avatar: string | null; isEmailVerified: boolean }> {
    const user = await this.validateUser(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    };
  }
}

import { Controller, Post, Body, Get, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ResendVerificationDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Query('email') email: string) {
    return this.authService.verifyEmail(token, email);
  }

  @Post('resend-verification')
  @HttpCode(200)
  async resendVerification(@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerification(resendDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}

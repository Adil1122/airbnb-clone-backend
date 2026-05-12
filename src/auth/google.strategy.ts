import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value;

    if (!email) return done(new Error('No email from Google'));

    let user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      user = this.userRepo.create({
        email,
        name,
        avatar,
        password: '',
        isEmailVerified: true,
      });
      await this.userRepo.save(user);
    } else {
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        await this.userRepo.save(user);
      }
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    done(null, { ...user, accessToken: token });
  }
}

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from './auth.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    private generateVerificationToken;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    sendVerificationEmail(user: User): Promise<void>;
    verifyEmail(token: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: number): Promise<User>;
    getProfile(userId: number): Promise<any>;
}

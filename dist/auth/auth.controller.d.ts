import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ResendVerificationDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.dto").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("./auth.dto").AuthResponseDto>;
    verifyEmail(token: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerification(resendDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}

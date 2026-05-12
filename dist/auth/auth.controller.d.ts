import type { Response } from 'express';
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
    updateProfile(req: any, profileData: any): Promise<any>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<any>;
    uploadIDCard(req: any, file: Express.Multer.File): Promise<any>;
    googleLogin(): void;
    googleCallback(req: any, res: Response): void;
    googleTokenLogin(body: {
        idToken: string;
    }): Promise<import("./auth.dto").AuthResponseDto>;
}

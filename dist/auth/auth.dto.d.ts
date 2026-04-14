export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    };
}
export declare class ResendVerificationDto {
    email: string;
}

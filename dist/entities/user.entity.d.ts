export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar: string;
    phone: string;
    isEmailVerified: boolean;
    emailVerificationToken: string | null;
    emailVerificationExpires: Date | null;
    verificationSentAt: Date;
    stripeCustomerId: string;
    createdAt: Date;
    updatedAt: Date;
}

import { Property } from './property.entity';
import { Experience } from './experience.entity';
import { Service } from './service.entity';
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
    role: string;
    hostStatus: string | null;
    hostSince: Date | null;
    hostBio: string | null;
    hostLanguages: string[] | null;
    isIdentityVerified: boolean;
    isPhoneVerified: boolean;
    isSuperhost: boolean;
    properties: Property[];
    experiences: Experience[];
    services: Service[];
    createdAt: Date;
    updatedAt: Date;
}

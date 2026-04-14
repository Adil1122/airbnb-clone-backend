import { User } from './user.entity';
export declare class PaymentMethod {
    id: number;
    userId: number;
    user: User;
    stripePaymentMethodId: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
    createdAt: Date;
}

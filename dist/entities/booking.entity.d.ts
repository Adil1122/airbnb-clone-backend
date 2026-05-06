import { User } from './user.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    DECLINED = "declined",
    EXPIRED = "expired"
}
export declare enum CancellationPolicy {
    FLEXIBLE = "flexible",
    MODERATE = "moderate",
    STRICT = "strict",
    SUPER_STRICT_30 = "super_strict_30",
    SUPER_STRICT_60 = "super_strict_60"
}
export declare class Booking {
    id: number;
    uuid: string;
    generateUuid(): void;
    propertyId: number;
    userId: number;
    hostId: number;
    user: User;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    guests: number;
    numChildren: number;
    numInfants: number;
    numPets: number;
    propertyPrice: number;
    cleaningFee: number;
    serviceFee: number;
    taxAmount: number;
    discountAmount: number;
    totalPrice: number;
    currency: string;
    hostPayoutAmount: number;
    status: BookingStatus;
    cancellationPolicy: CancellationPolicy;
    stripePaymentIntentId: string;
    stripeChargeId: string;
    stripeTransferId: string;
    stripeApplicationFeeId: string;
    stripeResponse: any;
    messageToHost: string;
    hostMessage: string;
    confirmedAt: Date;
    cancelledAt: Date;
    cancelledBy: number;
    cancellationReason: string | null;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

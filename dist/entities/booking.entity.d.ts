import { User } from './user.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class Booking {
    id: number;
    propertyId: number;
    userId: number;
    user: User;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    serviceFee: number;
    cleaningFee: number;
    propertyPrice: number;
    nights: number;
    stripePaymentIntentId: string;
    status: BookingStatus;
    messageToHost: string;
    createdAt: Date;
}

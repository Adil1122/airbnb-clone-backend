import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import Stripe from 'stripe';
export declare class PaymentService {
    private bookingRepository;
    private userRepository;
    private stripe;
    constructor(bookingRepository: Repository<Booking>, userRepository: Repository<User>);
    createPaymentIntent(userId: number, amount: number, currency?: string, metadata?: any): Promise<{
        clientSecret: string | null;
        id: string;
    }>;
    confirmPayment(paymentIntentId: string, bookingData: any): Promise<Booking[]>;
    getBooking(id: number): Promise<Booking | null>;
    getBookingsByUser(userId: number): Promise<Booking[]>;
    cancelBooking(id: number, userId: number): Promise<Booking | null>;
    updateBookingMessage(id: number, userId: number, message: string): Promise<Booking | null>;
    listUserPaymentMethods(userId: number): Promise<Stripe.PaymentMethod[]>;
    savePaymentMethod(userId: number, paymentMethodId: string): Promise<{
        success: boolean;
    }>;
}

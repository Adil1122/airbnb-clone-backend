import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { User } from '../entities/user.entity';
export declare class PaymentService {
    private bookingRepository;
    private paymentMethodRepository;
    private userRepository;
    private stripe;
    constructor(bookingRepository: Repository<Booking>, paymentMethodRepository: Repository<PaymentMethod>, userRepository: Repository<User>);
    getStripeCustomer(userId: number): Promise<string>;
    savePaymentMethod(userId: number, stripePaymentMethodId: string): Promise<PaymentMethod | null>;
    listUserPaymentMethods(userId: number): Promise<PaymentMethod[]>;
    createPaymentIntent(userId: number, amount: number, currency?: string, metadata?: any): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string, bookingData: {
        propertyId: number;
        userId: number;
        checkIn: Date;
        checkOut: Date;
        guests: number;
        totalPrice: number;
        serviceFee: number;
        cleaningFee: number;
        propertyPrice: number;
        nights: number;
        messageToHost?: string;
    }): Promise<Booking | null>;
    getBooking(id: number): Promise<Booking | null>;
    getBookingsByUser(userId: number): Promise<Booking[]>;
    cancelBooking(id: number, userId: number): Promise<Booking | null>;
    updateBookingMessage(id: number, userId: number, message: string): Promise<Booking | null>;
}

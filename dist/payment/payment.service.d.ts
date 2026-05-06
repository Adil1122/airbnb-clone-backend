import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { StripeWebhookEvent } from '../entities/stripe-webhook-event.entity';
import Stripe from 'stripe';
export declare class PaymentService {
    private bookingRepository;
    private userRepository;
    private webhookEventRepository;
    private stripe;
    constructor(bookingRepository: Repository<Booking>, userRepository: Repository<User>, webhookEventRepository: Repository<StripeWebhookEvent>);
    createPaymentIntent(userId: number, propertyId: number, hostId: number, amount: number, serviceFee: number, currency?: string): Promise<{
        clientSecret: string | null;
        id: string;
    }>;
    capturePayment(bookingId: number): Promise<Booking>;
    refundPayment(bookingId: number, amount?: number): Promise<Booking>;
    createStripeAccount(userId: number): Promise<{
        accountId: string;
    }>;
    createStripeAccountLink(userId: number): Promise<{
        url: string;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
    private processPaymentSuccess;
    private processPaymentFailure;
    private processAccountUpdate;
    savePaymentMethod(userId: number, paymentMethodId: string): Promise<{
        success: boolean;
    }>;
    listUserPaymentMethods(userId: number): Promise<Stripe.PaymentMethod[]>;
}

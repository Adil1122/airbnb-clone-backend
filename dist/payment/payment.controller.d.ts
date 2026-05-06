import { type RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request as ExpressRequest } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPaymentIntent(body: {
        amount: number;
        propertyId: number;
        hostId: number;
        serviceFee: number;
        currency?: string;
    }, req: any): Promise<{
        clientSecret: string | null;
        id: string;
    }>;
    capturePayment(body: {
        bookingId: number;
    }): Promise<import("../entities/booking.entity").Booking>;
    refundPayment(body: {
        bookingId: number;
        amount?: number;
    }): Promise<import("../entities/booking.entity").Booking>;
    getPaymentMethods(req: any): Promise<import("stripe").Stripe.PaymentMethod[]>;
    savePaymentMethod(body: {
        paymentMethodId: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
    createHostStripeAccount(req: any): Promise<{
        accountId: string;
    }>;
    createOnboardingLink(req: any): Promise<{
        url: string;
    }>;
    handleWebhook(req: RawBodyRequest<ExpressRequest>, signature: string): Promise<{
        received: boolean;
    }>;
}

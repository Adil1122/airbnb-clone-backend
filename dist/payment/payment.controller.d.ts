import { PaymentService } from './payment.service';
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    createPaymentIntent(body: {
        amount: number;
        propertyId: number;
        checkIn: string;
        checkOut: string;
        guests: number;
    }, req: any): Promise<{
        clientSecret: string | null;
        id: string;
    }>;
    confirmBooking(body: {
        paymentIntentId: string;
        propertyId: number;
        checkIn: string;
        checkOut: string;
        guests: number;
        totalPrice: number;
        serviceFee: number;
        cleaningFee: number;
        propertyPrice: number;
        nights: number;
        messageToHost?: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        booking?: undefined;
    } | {
        success: boolean;
        booking: import("../entities/booking.entity").Booking[];
        message?: undefined;
    }>;
    getBooking(id: string, req: any): Promise<import("../entities/booking.entity").Booking | {
        error: string;
    }>;
    getBookings(req: any): Promise<import("../entities/booking.entity").Booking[]>;
    cancelBooking(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        booking?: undefined;
    } | {
        success: boolean;
        booking: import("../entities/booking.entity").Booking;
        message?: undefined;
    }>;
    updateMessage(id: string, body: {
        message: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        booking?: undefined;
    } | {
        success: boolean;
        booking: import("../entities/booking.entity").Booking;
        message?: undefined;
    }>;
    getPaymentMethods(req: any): Promise<import("stripe").Stripe.PaymentMethod[]>;
    savePaymentMethod(body: {
        paymentMethodId: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
}

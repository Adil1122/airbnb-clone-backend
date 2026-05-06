"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const user_entity_1 = require("../entities/user.entity");
const stripe_webhook_event_entity_1 = require("../entities/stripe-webhook-event.entity");
const stripe_1 = __importDefault(require("stripe"));
let PaymentService = class PaymentService {
    bookingRepository;
    userRepository;
    webhookEventRepository;
    stripe;
    constructor(bookingRepository, userRepository, webhookEventRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
            apiVersion: '2024-06-20',
        });
    }
    async createPaymentIntent(userId, propertyId, hostId, amount, serviceFee, currency = 'usd') {
        try {
            const guest = await this.userRepository.findOne({ where: { id: userId } });
            const host = await this.userRepository.findOne({ where: { id: hostId } });
            if (!guest || !host) {
                throw new common_1.NotFoundException('Guest or Host not found');
            }
            if (!host.stripeAccountId) {
                throw new common_1.BadRequestException('Host has not connected a Stripe account');
            }
            let stripeCustomerId = guest.stripeCustomerId;
            if (!stripeCustomerId) {
                const customer = await this.stripe.customers.create({
                    email: guest.email,
                    name: guest.name,
                });
                stripeCustomerId = customer.id;
                guest.stripeCustomerId = stripeCustomerId;
                await this.userRepository.save(guest);
            }
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                customer: stripeCustomerId,
                application_fee_amount: Math.round(serviceFee * 100),
                transfer_data: {
                    destination: host.stripeAccountId,
                },
                capture_method: 'manual',
                metadata: {
                    guestId: userId.toString(),
                    hostId: hostId.toString(),
                    propertyId: propertyId.toString(),
                },
            });
            return {
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id,
            };
        }
        catch (error) {
            console.error('ERROR [PaymentService] createPaymentIntent:', error);
            throw error;
        }
    }
    async capturePayment(bookingId) {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking || !booking.stripePaymentIntentId) {
            throw new common_1.NotFoundException('Booking or PaymentIntent not found');
        }
        try {
            const captured = await this.stripe.paymentIntents.capture(booking.stripePaymentIntentId);
            booking.status = booking_entity_1.BookingStatus.CONFIRMED;
            booking.stripeResponse = captured;
            if (captured.latest_charge) {
                booking.stripeChargeId = captured.latest_charge;
            }
            return await this.bookingRepository.save(booking);
        }
        catch (error) {
            console.error('ERROR [PaymentService] capturePayment:', error);
            throw error;
        }
    }
    async refundPayment(bookingId, amount) {
        const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking || !booking.stripePaymentIntentId) {
            throw new common_1.NotFoundException('Booking or PaymentIntent not found');
        }
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: booking.stripePaymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
                reverse_transfer: true,
                refund_application_fee: true,
            });
            booking.status = booking_entity_1.BookingStatus.CANCELLED;
            booking.stripeResponse = { ...booking.stripeResponse, refund };
            return await this.bookingRepository.save(booking);
        }
        catch (error) {
            console.error('ERROR [PaymentService] refundPayment:', error);
            throw error;
        }
    }
    async createStripeAccount(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.stripeAccountId) {
            return { accountId: user.stripeAccountId };
        }
        const account = await this.stripe.accounts.create({
            type: 'express',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        user.stripeAccountId = account.id;
        await this.userRepository.save(user);
        return { accountId: account.id };
    }
    async createStripeAccountLink(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.stripeAccountId) {
            throw new common_1.NotFoundException('Stripe account not found');
        }
        const accountLink = await this.stripe.accountLinks.create({
            account: user.stripeAccountId,
            refresh_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/payouts?refresh=true`,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/payouts?success=true`,
            type: 'account_onboarding',
        });
        return { url: accountLink.url };
    }
    async handleWebhook(payload, signature) {
        const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new common_1.BadRequestException('Stripe webhook secret is not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, WEBHOOK_SECRET);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        const existingEvent = await this.webhookEventRepository.findOne({ where: { id: event.id } });
        if (existingEvent)
            return { received: true };
        const webhookEvent = this.webhookEventRepository.create({
            id: event.id,
            type: event.type,
            payload: event,
        });
        await this.webhookEventRepository.save(webhookEvent);
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.processPaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.processPaymentFailure(event.data.object);
                    break;
                case 'account.updated':
                    await this.processAccountUpdate(event.data.object);
                    break;
            }
            webhookEvent.processed = true;
            webhookEvent.processedAt = new Date();
            await this.webhookEventRepository.save(webhookEvent);
        }
        catch (error) {
            webhookEvent.errorMessage = error.message;
            await this.webhookEventRepository.save(webhookEvent);
            throw error;
        }
        return { received: true };
    }
    async processPaymentSuccess(paymentIntent) {
        const booking = await this.bookingRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id }
        });
        if (booking) {
            booking.status = booking_entity_1.BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
            await this.bookingRepository.save(booking);
        }
    }
    async processPaymentFailure(paymentIntent) {
        const booking = await this.bookingRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id }
        });
        if (booking) {
            booking.status = booking_entity_1.BookingStatus.CANCELLED;
            booking.cancellationReason = 'Payment failed';
            await this.bookingRepository.save(booking);
        }
    }
    async processAccountUpdate(account) {
        if (account.details_submitted) {
            const user = await this.userRepository.findOne({
                where: { stripeAccountId: account.id }
            });
            if (user) {
                user.isStripeConnected = true;
                await this.userRepository.save(user);
            }
        }
    }
    async savePaymentMethod(userId, paymentMethodId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await this.stripe.customers.create({
                email: user.email,
                name: user.name,
            });
            stripeCustomerId = customer.id;
            user.stripeCustomerId = stripeCustomerId;
            await this.userRepository.save(user);
        }
        await this.stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
        });
        return { success: true };
    }
    async listUserPaymentMethods(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.stripeCustomerId)
            return [];
        const paymentMethods = await this.stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });
        return paymentMethods.data;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(stripe_webhook_event_entity_1.StripeWebhookEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map
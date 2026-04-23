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
const stripe_1 = __importDefault(require("stripe"));
let PaymentService = class PaymentService {
    bookingRepository;
    userRepository;
    stripe;
    constructor(bookingRepository, userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
            apiVersion: '2024-06-20',
        });
    }
    async createPaymentIntent(userId, amount, currency = 'usd', metadata = {}) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
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
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                customer: stripeCustomerId,
                metadata: {
                    ...metadata,
                    userId: userId.toString(),
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
    async confirmPayment(paymentIntentId, bookingData) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'requires_capture') {
                console.warn(`[PaymentService] Payment intent status is ${paymentIntent.status}`);
            }
            const booking = this.bookingRepository.create({
                ...bookingData,
                stripePaymentIntentId: paymentIntentId,
                status: booking_entity_1.BookingStatus.CONFIRMED,
            });
            return await this.bookingRepository.save(booking);
        }
        catch (error) {
            console.error('ERROR [PaymentService] confirmPayment:', error);
            throw error;
        }
    }
    async getBooking(id) {
        return await this.bookingRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }
    async getBookingsByUser(userId) {
        return await this.bookingRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async cancelBooking(id, userId) {
        const booking = await this.bookingRepository.findOne({ where: { id, userId } });
        if (!booking)
            return null;
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        return await this.bookingRepository.save(booking);
    }
    async updateBookingMessage(id, userId, message) {
        const booking = await this.bookingRepository.findOne({ where: { id, userId } });
        if (!booking)
            return null;
        booking.messageToHost = message;
        return await this.bookingRepository.save(booking);
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map
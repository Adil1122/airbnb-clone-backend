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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPaymentIntent(body, req) {
        try {
            const result = await this.paymentService.createPaymentIntent(req.user.id, body.amount, 'usd', {
                propertyId: body.propertyId,
                checkIn: body.checkIn,
                checkOut: body.checkOut,
                guests: body.guests,
            });
            return { success: true, ...result };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to create payment intent',
                error: error.raw?.message || error.toString()
            };
        }
    }
    async confirmBooking(body, req) {
        const booking = await this.paymentService.confirmPayment(body.paymentIntentId, {
            propertyId: body.propertyId,
            userId: req.user.id,
            checkIn: new Date(body.checkIn),
            checkOut: new Date(body.checkOut),
            guests: body.guests,
            totalPrice: body.totalPrice,
            serviceFee: body.serviceFee,
            cleaningFee: body.cleaningFee,
            propertyPrice: body.propertyPrice,
            nights: body.nights,
            messageToHost: body.messageToHost,
        });
        if (!booking) {
            return { success: false, message: 'Payment not completed or booking failed' };
        }
        return { success: true, booking };
    }
    async getBooking(id, req) {
        const booking = await this.paymentService.getBooking(parseInt(id));
        if (!booking || booking.userId !== req.user.id) {
            return { error: 'Booking not found' };
        }
        return booking;
    }
    async getBookings(req) {
        return await this.paymentService.getBookingsByUser(req.user.id);
    }
    async cancelBooking(id, req) {
        const booking = await this.paymentService.cancelBooking(parseInt(id), req.user.id);
        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }
        return { success: true, booking };
    }
    async updateMessage(id, body, req) {
        const booking = await this.paymentService.updateBookingMessage(parseInt(id), req.user.id, body.message);
        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }
        return { success: true, booking };
    }
    async getPaymentMethods(req) {
        return await this.paymentService.listUserPaymentMethods(req.user.id);
    }
    async savePaymentMethod(body, req) {
        return await this.paymentService.savePaymentMethod(req.user.id, body.paymentMethodId);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('create-payment-intent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('confirm-booking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Get)('booking/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Post)('cancel/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)('update-message/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Get)('methods'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Post)('methods/save'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "savePaymentMethod", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map
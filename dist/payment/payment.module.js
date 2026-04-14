"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const booking_entity_1 = require("../entities/booking.entity");
const payment_method_entity_1 = require("../entities/payment-method.entity");
const user_entity_1 = require("../entities/user.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const auth_module_1 = require("../auth/auth.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, payment_method_entity_1.PaymentMethod, user_entity_1.User]),
            auth_module_1.AuthModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, jwt_auth_guard_1.JwtAuthGuard],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map
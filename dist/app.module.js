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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const categories_module_1 = require("./categories/categories.module");
const properties_module_1 = require("./properties/properties.module");
const experiences_module_1 = require("./experiences/experiences.module");
const services_module_1 = require("./services/services.module");
const destinations_module_1 = require("./destinations/destinations.module");
const filters_module_1 = require("./filters/filters.module");
const seed_service_1 = require("./seed.service");
const auth_module_1 = require("./auth/auth.module");
const payment_module_1 = require("./payment/payment.module");
const host_module_1 = require("./host/host.module");
const user_entity_1 = require("./entities/user.entity");
const booking_entity_1 = require("./entities/booking.entity");
const property_entity_1 = require("./entities/property.entity");
let AppModule = class AppModule {
    seedService;
    constructor(seedService) {
        this.seedService = seedService;
    }
    async onModuleInit() {
        await this.seedService.checkAndSeed();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                synchronize: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, booking_entity_1.Booking, property_entity_1.Property]),
            categories_module_1.CategoriesModule,
            properties_module_1.PropertiesModule,
            experiences_module_1.ExperiencesModule,
            services_module_1.ServicesModule,
            destinations_module_1.DestinationsModule,
            filters_module_1.FiltersModule,
            auth_module_1.AuthModule,
            payment_module_1.PaymentModule,
            host_module_1.HostModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seed_service_1.SeedService],
    }),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map
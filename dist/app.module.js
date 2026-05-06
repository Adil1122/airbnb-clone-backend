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
const auth_module_1 = require("./auth/auth.module");
const payment_module_1 = require("./payment/payment.module");
const host_module_1 = require("./host/host.module");
const supabase_module_1 = require("./supabase/supabase.module");
const user_settings_module_1 = require("./user-settings/user-settings.module");
const wishlists_module_1 = require("./wishlists/wishlists.module");
const reviews_module_1 = require("./reviews/reviews.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const bookings_module_1 = require("./bookings/bookings.module");
const seed_service_1 = require("./seed.service");
const user_entity_1 = require("./entities/user.entity");
const booking_entity_1 = require("./entities/booking.entity");
const property_entity_1 = require("./entities/property.entity");
const property_image_entity_1 = require("./entities/property-image.entity");
const property_availability_entity_1 = require("./entities/property-availability.entity");
const property_rule_entity_1 = require("./entities/property-rule.entity");
const category_entity_1 = require("./entities/category.entity");
const experience_entity_1 = require("./entities/experience.entity");
const service_entity_1 = require("./entities/service.entity");
const destination_entity_1 = require("./entities/destination.entity");
const amenity_entity_1 = require("./entities/amenity.entity");
const review_entity_1 = require("./entities/review.entity");
const payment_method_entity_1 = require("./entities/payment-method.entity");
const user_settings_entity_1 = require("./entities/user-settings.entity");
const host_action_entity_1 = require("./entities/host-action.entity");
const filter_options_entity_1 = require("./entities/filter-options.entity");
const rule_category_entity_1 = require("./entities/rule-category.entity");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const wishlist_item_entity_1 = require("./entities/wishlist-item.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const notification_entity_1 = require("./entities/notification.entity");
const notification_preference_entity_1 = require("./entities/notification-preference.entity");
const promotion_entity_1 = require("./entities/promotion.entity");
const promotion_redemption_entity_1 = require("./entities/promotion-redemption.entity");
const stripe_webhook_event_entity_1 = require("./entities/stripe-webhook-event.entity");
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
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '6543'),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                synchronize: true,
                logging: process.env.NODE_ENV !== 'production',
                entities: [
                    user_entity_1.User, booking_entity_1.Booking, property_entity_1.Property, property_image_entity_1.PropertyImage, property_availability_entity_1.PropertyAvailability,
                    property_rule_entity_1.PropertyRule, category_entity_1.Category, experience_entity_1.Experience, service_entity_1.Service, destination_entity_1.Destination,
                    amenity_entity_1.Amenity, review_entity_1.Review, payment_method_entity_1.PaymentMethod, user_settings_entity_1.UserSettings, host_action_entity_1.HostAction,
                    filter_options_entity_1.GuestCategory, filter_options_entity_1.SearchDuration, rule_category_entity_1.RuleCategory,
                    wishlist_entity_1.Wishlist, wishlist_item_entity_1.WishlistItem,
                    conversation_entity_1.Conversation, message_entity_1.Message,
                    notification_entity_1.Notification, notification_preference_entity_1.NotificationPreference,
                    promotion_entity_1.Promotion, promotion_redemption_entity_1.PromotionRedemption,
                    stripe_webhook_event_entity_1.StripeWebhookEvent,
                ],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, booking_entity_1.Booking, property_entity_1.Property, user_settings_entity_1.UserSettings]),
            categories_module_1.CategoriesModule,
            properties_module_1.PropertiesModule,
            experiences_module_1.ExperiencesModule,
            services_module_1.ServicesModule,
            destinations_module_1.DestinationsModule,
            filters_module_1.FiltersModule,
            auth_module_1.AuthModule,
            payment_module_1.PaymentModule,
            host_module_1.HostModule,
            supabase_module_1.SupabaseModule,
            user_settings_module_1.UserSettingsModule,
            wishlists_module_1.WishlistsModule,
            reviews_module_1.ReviewsModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            bookings_module_1.BookingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seed_service_1.SeedService],
    }),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map
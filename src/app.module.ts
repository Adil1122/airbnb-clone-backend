import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature modules
import { CategoriesModule } from './categories/categories.module';
import { PropertiesModule } from './properties/properties.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ServicesModule } from './services/services.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FiltersModule } from './filters/filters.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { HostModule } from './host/host.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BookingsModule } from './bookings/bookings.module';

// Seed
import { SeedService } from './seed.service';

// Entities
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { PropertyAvailability } from './entities/property-availability.entity';
import { PropertyRule } from './entities/property-rule.entity';
import { Category } from './entities/category.entity';
import { Experience } from './entities/experience.entity';
import { Service } from './entities/service.entity';
import { Destination } from './entities/destination.entity';
import { Amenity } from './entities/amenity.entity';
import { Review } from './entities/review.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { UserSettings } from './entities/user-settings.entity';
import { HostAction } from './entities/host-action.entity';
import { GuestCategory, SearchDuration } from './entities/filter-options.entity';
import { RuleCategory } from './entities/rule-category.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { Promotion } from './entities/promotion.entity';
import { PromotionRedemption } from './entities/promotion-redemption.entity';
import { StripeWebhookEvent } from './entities/stripe-webhook-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
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
        User, Booking, Property, PropertyImage, PropertyAvailability,
        PropertyRule, Category, Experience, Service, Destination,
        Amenity, Review, PaymentMethod, UserSettings, HostAction,
        GuestCategory, SearchDuration, RuleCategory,
        Wishlist, WishlistItem,
        Conversation, Message,
        Notification, NotificationPreference,
        Promotion, PromotionRedemption,
        StripeWebhookEvent,
      ],
    }),
    TypeOrmModule.forFeature([User, Booking, Property, UserSettings]),

    // Original modules
    CategoriesModule,
    PropertiesModule,
    ExperiencesModule,
    ServicesModule,
    DestinationsModule,
    FiltersModule,
    AuthModule,
    PaymentModule,
    HostModule,
    SupabaseModule,
    UserSettingsModule,

    // New modules
    WishlistsModule,
    ReviewsModule,
    MessagesModule,
    NotificationsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.checkAndSeed();
  }
}

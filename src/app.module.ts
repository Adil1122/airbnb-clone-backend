import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { PropertiesModule } from './properties/properties.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ServicesModule } from './services/services.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FiltersModule } from './filters/filters.module';
import { SeedService } from './seed.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { HostModule } from './host/host.module';
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { Property } from './entities/property.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Booking, Property]),
    CategoriesModule,
    PropertiesModule,
    ExperiencesModule,
    ServicesModule,
    DestinationsModule,
    FiltersModule,
    AuthModule,
    PaymentModule,
    HostModule,
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

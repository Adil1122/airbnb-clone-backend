import { Module } from '@nestjs/common';
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
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';

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
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Booking]),
    CategoriesModule,
    PropertiesModule,
    ExperiencesModule,
    ServicesModule,
    DestinationsModule,
    FiltersModule,
    AuthModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule { }

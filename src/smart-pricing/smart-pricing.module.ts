import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { SmartPricingService } from './smart-pricing.service';
import { SmartPricingController } from './smart-pricing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Property])],
  controllers: [SmartPricingController],
  providers: [SmartPricingService],
  exports: [SmartPricingService],
})
export class SmartPricingModule {}

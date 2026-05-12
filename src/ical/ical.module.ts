import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { IcalService } from './ical.service';
import { IcalController } from './ical.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Property])],
  controllers: [IcalController],
  providers: [IcalService],
})
export class IcalModule {}

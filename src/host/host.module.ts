import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { Property } from '../entities/property.entity';
import { Amenity } from '../entities/amenity.entity';
import { PropertyImage } from '../entities/property-image.entity';
import { Category } from '../entities/category.entity';
import { PropertyAvailability } from '../entities/property-availability.entity';
import { HostAction } from '../entities/host-action.entity';
import { Booking } from '../entities/booking.entity';
import { PropertyRule } from '../entities/property-rule.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property, 
      Amenity, 
      PropertyImage, 
      Category, 
      PropertyAvailability, 
      HostAction, 
      Booking,
      PropertyRule,
      Review,
      User
    ]),
  ],
  controllers: [HostController],
  providers: [HostService],
})
export class HostModule {}

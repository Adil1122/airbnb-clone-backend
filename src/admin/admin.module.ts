import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Property } from '../entities/property.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Booking, Review])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

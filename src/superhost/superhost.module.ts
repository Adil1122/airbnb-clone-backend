import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';
import { SuperhostService } from './superhost.service';
import { SuperhostController } from './superhost.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Review]), EmailModule],
  controllers: [SuperhostController],
  providers: [SuperhostService],
  exports: [SuperhostService],
})
export class SuperhostModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { StripeWebhookEvent } from '../entities/stripe-webhook-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, StripeWebhookEvent])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

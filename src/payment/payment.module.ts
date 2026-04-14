import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Booking } from '../entities/booking.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, PaymentMethod, User]),
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, JwtAuthGuard],
  exports: [PaymentService],
})
export class PaymentModule { }

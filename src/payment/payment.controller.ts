import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @Body() body: { amount: number; propertyId: number; checkIn: string; checkOut: string; guests: number },
    @Request() req,
  ) {
    const result = await this.paymentService.createPaymentIntent(
      req.user.id,
      body.amount,
      'usd',
      {
        propertyId: body.propertyId,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: body.guests,
      },
    );
    return result;
  }

  @Post('confirm-booking')
  @UseGuards(JwtAuthGuard)
  async confirmBooking(
    @Body() body: {
      paymentIntentId: string;
      propertyId: number;
      checkIn: string;
      checkOut: string;
      guests: number;
      totalPrice: number;
      serviceFee: number;
      cleaningFee: number;
      propertyPrice: number;
      nights: number;
      messageToHost?: string;
    },
    @Request() req,
  ) {
    const booking = await this.paymentService.confirmPayment(body.paymentIntentId, {
      propertyId: body.propertyId,
      userId: req.user.id,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      guests: body.guests,
      totalPrice: body.totalPrice,
      serviceFee: body.serviceFee,
      cleaningFee: body.cleaningFee,
      propertyPrice: body.propertyPrice,
      nights: body.nights,
      messageToHost: body.messageToHost,
    });

    if (!booking) {
      return { success: false, message: 'Payment not completed or booking failed' };
    }

    return { success: true, booking };
  }

  @Get('booking/:id')
  @UseGuards(JwtAuthGuard)
  async getBooking(@Param('id') id: string, @Request() req) {
    const booking = await this.paymentService.getBooking(parseInt(id));
    if (!booking || booking.userId !== req.user.id) {
      return { error: 'Booking not found' };
    }
    return booking;
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async getBookings(@Request() req) {
    return await this.paymentService.getBookingsByUser(req.user.id);
  }

  @Post('cancel/:id')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Param('id') id: string, @Request() req) {
    const booking = await this.paymentService.cancelBooking(parseInt(id), req.user.id);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }
    return { success: true, booking };
  }

  @Post('update-message/:id')
  @UseGuards(JwtAuthGuard)
  async updateMessage(
    @Param('id') id: string,
    @Body() body: { message: string },
    @Request() req,
  ) {
    const booking = await this.paymentService.updateBookingMessage(parseInt(id), req.user.id, body.message);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }
    return { success: true, booking };
  }

  @Get('methods')
  @UseGuards(JwtAuthGuard)
  async getPaymentMethods(@Request() req) {
    return await this.paymentService.listUserPaymentMethods(req.user.id);
  }

  @Post('methods/save')
  @UseGuards(JwtAuthGuard)
  async savePaymentMethod(
    @Body() body: { paymentMethodId: string },
    @Request() req,
  ) {
    return await this.paymentService.savePaymentMethod(req.user.id, body.paymentMethodId);
  }
}

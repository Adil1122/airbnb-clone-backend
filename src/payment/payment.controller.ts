import { Controller, Post, Get, Body, Param, UseGuards, Request, Headers, type RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @Body() body: { amount: number; propertyId: number; hostId: number; serviceFee: number; currency?: string },
    @Request() req,
  ) {
    return this.paymentService.createPaymentIntent(
      req.user.id,
      body.propertyId,
      body.hostId,
      body.amount,
      body.serviceFee,
      body.currency,
    );
  }

  @Post('capture')
  @UseGuards(JwtAuthGuard)
  async capturePayment(@Body() body: { bookingId: number }) {
    return this.paymentService.capturePayment(body.bookingId);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Body() body: { bookingId: number; amount?: number }) {
    return this.paymentService.refundPayment(body.bookingId, body.amount);
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

  @Post('host/create-account')
  @UseGuards(JwtAuthGuard)
  async createHostStripeAccount(@Request() req) {
    return await this.paymentService.createStripeAccount(req.user.id);
  }

  @Post('host/create-onboarding-link')
  @UseGuards(JwtAuthGuard)
  async createOnboardingLink(@Request() req) {
    return await this.paymentService.createStripeAccountLink(req.user.id);
  }

  @Post('webhook')
  async handleWebhook(
    @Request() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }
}

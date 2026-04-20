import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createPaymentIntent(userId: number, amount: number, currency: string = 'usd', metadata: any = {}) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await this.userRepository.save(user);
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      customer: stripeCustomerId,
      metadata: {
        ...metadata,
        userId: userId.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string, bookingData: any) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      // payment failed logic could go here
    }

    const booking = this.bookingRepository.create({
      ...bookingData,
      stripePaymentIntentId: paymentIntentId,
      status: BookingStatus.CONFIRMED,
    });

    return await this.bookingRepository.save(booking);
  }

  async getBooking(id: number) {
    return await this.bookingRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
  }

  async getBookingsByUser(userId: number) {
    return await this.bookingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.bookingRepository.findOne({ where: { id, userId } });
    if (!booking) return null;

    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }

  async updateBookingMessage(id: number, userId: number, message: string) {
    const booking = await this.bookingRepository.findOne({ where: { id, userId } });
    if (!booking) return null;

    booking.messageToHost = message;
    return await this.bookingRepository.save(booking);
  }

  async listUserPaymentMethods(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) return [];

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  async savePaymentMethod(userId: number, paymentMethodId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await this.userRepository.save(user);
    }

    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    return { success: true };
  }
}

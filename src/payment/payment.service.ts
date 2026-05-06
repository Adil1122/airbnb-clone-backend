import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { StripeWebhookEvent } from '../entities/stripe-webhook-event.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(StripeWebhookEvent)
    private webhookEventRepository: Repository<StripeWebhookEvent>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2024-06-20' as any,
    });
  }

  // --- Guest Methods ---

  async createPaymentIntent(userId: number, propertyId: number, hostId: number, amount: number, serviceFee: number, currency: string = 'usd') {
    try {
      const guest = await this.userRepository.findOne({ where: { id: userId } });
      const host = await this.userRepository.findOne({ where: { id: hostId } });
      
      if (!guest || !host) {
        throw new NotFoundException('Guest or Host not found');
      }

      if (!host.stripeAccountId) {
        throw new BadRequestException('Host has not connected a Stripe account');
      }

      let stripeCustomerId = guest.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          email: guest.email,
          name: guest.name,
        });
        stripeCustomerId = customer.id;
        guest.stripeCustomerId = stripeCustomerId;
        await this.userRepository.save(guest);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // cents
        currency,
        customer: stripeCustomerId,
        application_fee_amount: Math.round(serviceFee * 100), // cents
        transfer_data: {
          destination: host.stripeAccountId,
        },
        capture_method: 'manual', // Hold funds, capture at check-in
        metadata: {
          guestId: userId.toString(),
          hostId: hostId.toString(),
          propertyId: propertyId.toString(),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      console.error('ERROR [PaymentService] createPaymentIntent:', error);
      throw error;
    }
  }

  async capturePayment(bookingId: number) {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking || !booking.stripePaymentIntentId) {
      throw new NotFoundException('Booking or PaymentIntent not found');
    }

    try {
      const captured = await this.stripe.paymentIntents.capture(booking.stripePaymentIntentId);
      
      booking.status = BookingStatus.CONFIRMED;
      booking.stripeResponse = captured;
      if (captured.latest_charge) {
        booking.stripeChargeId = captured.latest_charge as string;
      }
      
      return await this.bookingRepository.save(booking);
    } catch (error) {
      console.error('ERROR [PaymentService] capturePayment:', error);
      throw error;
    }
  }

  async refundPayment(bookingId: number, amount?: number) {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking || !booking.stripePaymentIntentId) {
      throw new NotFoundException('Booking or PaymentIntent not found');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: booking.stripePaymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reverse_transfer: true,
        refund_application_fee: true,
      });

      booking.status = BookingStatus.CANCELLED;
      booking.stripeResponse = { ...booking.stripeResponse, refund };
      
      return await this.bookingRepository.save(booking);
    } catch (error) {
      console.error('ERROR [PaymentService] refundPayment:', error);
      throw error;
    }
  }

  // --- Host Onboarding ---

  async createStripeAccount(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.stripeAccountId) {
      return { accountId: user.stripeAccountId };
    }

    const account = await this.stripe.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    user.stripeAccountId = account.id;
    await this.userRepository.save(user);

    return { accountId: account.id };
  }

  async createStripeAccountLink(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.stripeAccountId) {
      throw new NotFoundException('Stripe account not found');
    }

    const accountLink = await this.stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/payouts?refresh=true`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/host/payouts?success=true`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  }

  // --- Webhook Handling ---

  async handleWebhook(payload: any, signature: string) {
    const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new BadRequestException('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, WEBHOOK_SECRET);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Idempotency check
    const existingEvent = await this.webhookEventRepository.findOne({ where: { id: event.id } });
    if (existingEvent) return { received: true };

    const webhookEvent = this.webhookEventRepository.create({
      id: event.id,
      type: event.type,
      payload: event,
    });
    await this.webhookEventRepository.save(webhookEvent);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.processPaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.processPaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        case 'account.updated':
          await this.processAccountUpdate(event.data.object as Stripe.Account);
          break;
      }

      webhookEvent.processed = true;
      webhookEvent.processedAt = new Date();
      await this.webhookEventRepository.save(webhookEvent);
    } catch (error) {
      webhookEvent.errorMessage = error.message;
      await this.webhookEventRepository.save(webhookEvent);
      throw error;
    }

    return { received: true };
  }

  private async processPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const booking = await this.bookingRepository.findOne({ 
      where: { stripePaymentIntentId: paymentIntent.id } 
    });
    if (booking) {
      booking.status = BookingStatus.CONFIRMED;
      booking.confirmedAt = new Date();
      await this.bookingRepository.save(booking);
    }
  }

  private async processPaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const booking = await this.bookingRepository.findOne({ 
      where: { stripePaymentIntentId: paymentIntent.id } 
    });
    if (booking) {
      booking.status = BookingStatus.CANCELLED;
      booking.cancellationReason = 'Payment failed';
      await this.bookingRepository.save(booking);
    }
  }

  private async processAccountUpdate(account: Stripe.Account) {
    if (account.details_submitted) {
      const user = await this.userRepository.findOne({ 
        where: { stripeAccountId: account.id } 
      });
      if (user) {
        user.isStripeConnected = true;
        await this.userRepository.save(user);
      }
    }
  }

  // --- Helpers ---

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

  async listUserPaymentMethods(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) return [];

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return paymentMethods.data;
  }
}


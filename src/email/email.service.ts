import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private get from() {
    return `"Airbnb Clone" <${process.env.EMAIL_USER || 'noreply@airbnb-clone.com'}>`;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!process.env.EMAIL_USER) {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await this.sendEmail(to, 'Welcome to Airbnb Clone!', `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been created successfully. Start exploring amazing stays around the world.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Explore Now</a>
    `);
  }

  async sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void> {
    await this.sendEmail(to, 'Reset Your Password', `
      <h2>Hi ${name},</h2>
      <p>You requested a password reset. Click the link below (expires in 1 hour):</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `);
  }

  async sendEmailVerification(to: string, name: string, verifyUrl: string): Promise<void> {
    await this.sendEmail(to, 'Verify Your Email Address', `
      <h2>Hi ${name},</h2>
      <p>Please verify your email address by clicking below:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `);
  }

  async sendBookingConfirmation(to: string, guestName: string, details: {
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalPrice: number;
    bookingId: number;
  }): Promise<void> {
    await this.sendEmail(to, 'Booking Confirmed!', `
      <h2>Hi ${guestName}, your booking is confirmed!</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td><strong>Property:</strong></td><td>${details.propertyTitle}</td></tr>
        <tr><td><strong>Check-in:</strong></td><td>${details.checkIn}</td></tr>
        <tr><td><strong>Check-out:</strong></td><td>${details.checkOut}</td></tr>
        <tr><td><strong>Nights:</strong></td><td>${details.nights}</td></tr>
        <tr><td><strong>Total:</strong></td><td>$${details.totalPrice}</td></tr>
        <tr><td><strong>Booking ID:</strong></td><td>#${details.bookingId}</td></tr>
      </table>
    `);
  }

  async sendBookingRequest(to: string, hostName: string, details: {
    guestName: string;
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalPrice: number;
    bookingId: number;
  }): Promise<void> {
    await this.sendEmail(to, 'New Booking Request', `
      <h2>Hi ${hostName}, you have a new booking request!</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td><strong>Guest:</strong></td><td>${details.guestName}</td></tr>
        <tr><td><strong>Property:</strong></td><td>${details.propertyTitle}</td></tr>
        <tr><td><strong>Check-in:</strong></td><td>${details.checkIn}</td></tr>
        <tr><td><strong>Check-out:</strong></td><td>${details.checkOut}</td></tr>
        <tr><td><strong>Nights:</strong></td><td>${details.nights}</td></tr>
        <tr><td><strong>Total:</strong></td><td>$${details.totalPrice}</td></tr>
      </table>
      <p>Please log in to confirm or decline this request.</p>
    `);
  }

  async sendBookingCancellation(to: string, name: string, details: {
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    reason?: string;
  }): Promise<void> {
    await this.sendEmail(to, 'Booking Cancelled', `
      <h2>Hi ${name}, a booking has been cancelled.</h2>
      <p><strong>Property:</strong> ${details.propertyTitle}</p>
      <p><strong>Check-in:</strong> ${details.checkIn}</p>
      <p><strong>Check-out:</strong> ${details.checkOut}</p>
      ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : ''}
    `);
  }

  async sendReviewReminder(to: string, guestName: string, propertyTitle: string): Promise<void> {
    await this.sendEmail(to, 'How was your stay?', `
      <h2>Hi ${guestName},</h2>
      <p>Your stay at <strong>${propertyTitle}</strong> has ended. Share your experience by leaving a review!</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/trips">Leave a Review</a>
    `);
  }

  async sendNewMessage(to: string, recipientName: string, senderName: string): Promise<void> {
    await this.sendEmail(to, `New message from ${senderName}`, `
      <h2>Hi ${recipientName},</h2>
      <p><strong>${senderName}</strong> sent you a message. Log in to reply.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/messages">View Message</a>
    `);
  }

  async sendSuperhostAchievement(to: string, name: string): Promise<void> {
    await this.sendEmail(to, 'Congratulations! You are now a Superhost!', `
      <h2>Congratulations, ${name}!</h2>
      <p>You've earned Superhost status! This recognition reflects your commitment to outstanding hospitality.</p>
      <p>Your Superhost badge is now visible to guests on your listings.</p>
    `);
  }
}

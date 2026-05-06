import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Booking, BookingStatus, CancellationPolicy } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import { Promotion } from '../entities/promotion.entity';
import { PromotionRedemption } from '../entities/promotion-redemption.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto, CancelBookingDto } from './bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
    @InjectRepository(Promotion)
    private promotionRepo: Repository<Promotion>,
    @InjectRepository(PromotionRedemption)
    private redemptionRepo: Repository<PromotionRedemption>,
    private notificationsService: NotificationsService,
  ) {}

  async getGuestBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getHostBookings(hostId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { hostId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOne(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId && booking.hostId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    return booking;
  }

  async create(userId: number, dto: CreateBookingDto): Promise<Booking> {
    const property = await this.propertyRepo.findOne({ where: { id: dto.propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    // Check availability — no overlapping confirmed/pending bookings
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const conflict = await this.bookingRepo
      .createQueryBuilder('b')
      .where('b.propertyId = :propertyId', { propertyId: dto.propertyId })
      .andWhere('b.status IN (:...statuses)', { statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING] })
      .andWhere('b.checkIn < :checkOut AND b.checkOut > :checkIn', { checkIn, checkOut })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Selected dates are not available');
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    let discountAmount = dto.discountAmount ?? 0;

    // Apply promo code if provided
    if (dto.promoCode) {
      const promo = await this.validatePromo(dto.promoCode, userId, dto.totalPrice, nights);
      if (promo) {
        discountAmount = this.calculatePromoDiscount(promo, dto.totalPrice);
      }
    }

    const booking = this.bookingRepo.create({
      ...dto,
      userId,
      nights,
      discountAmount,
      cleaningFee: dto.cleaningFee ?? 0,
      serviceFee: dto.serviceFee ?? 0,
      taxAmount: dto.taxAmount ?? 0,
      status: property.bookingType === 'instant' ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
      cancellationPolicy: dto.cancellationPolicy ?? CancellationPolicy.MODERATE,
      confirmedAt: property.bookingType === 'instant' ? new Date() : undefined,
    });

    const saved = await this.bookingRepo.save(booking);

    // Save promo redemption
    if (dto.promoCode && discountAmount > 0) {
      const promo = await this.promotionRepo.findOne({ where: { code: dto.promoCode.toUpperCase() } });
      if (promo) {
        await this.redemptionRepo.save({ promotionId: promo.id, userId, bookingId: saved.id, discountAmount });
        await this.promotionRepo.increment({ id: promo.id }, 'usesCount', 1);
      }
    }

    // Notify host
    await this.notificationsService.push(
      dto.hostId,
      'new_booking_request',
      'New Booking Request',
      `You have a new booking request for your property`,
      { bookingId: saved.id },
    );

    return saved;
  }

  async confirmBooking(id: number, hostId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id, hostId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }
    booking.status = BookingStatus.CONFIRMED;
    booking.confirmedAt = new Date();
    const saved = await this.bookingRepo.save(booking);

    await this.notificationsService.push(
      booking.userId,
      'booking_confirmed',
      'Booking Confirmed',
      'Your booking has been confirmed by the host!',
      { bookingId: id },
    );

    return saved;
  }

  async declineBooking(id: number, hostId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id, hostId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be declined');
    }
    booking.status = BookingStatus.DECLINED;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: number, userId: number, dto: CancelBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId && booking.hostId !== userId) {
      throw new ForbiddenException('Not authorized to cancel this booking');
    }
    if ([BookingStatus.CANCELLED, BookingStatus.COMPLETED].includes(booking.status)) {
      throw new BadRequestException('Booking cannot be cancelled');
    }
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancelledBy = userId;
    booking.cancellationReason = dto.reason ?? null;
    return this.bookingRepo.save(booking);
  }

  async validatePromoCode(code: string, userId: number, amount: number, nights: number) {
    const promo = await this.validatePromo(code, userId, amount, nights);
    if (!promo) throw new BadRequestException('Invalid or expired promo code');
    const discount = this.calculatePromoDiscount(promo, amount);
    return { valid: true, discount, promo };
  }

  async checkDateAvailability(propertyId: number, checkIn: string, checkOut: string): Promise<{ available: boolean }> {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const conflict = await this.bookingRepo
      .createQueryBuilder('b')
      .where('b.propertyId = :propertyId', { propertyId })
      .andWhere('b.status IN (:...statuses)', { statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING] })
      .andWhere('b.checkIn < :end AND b.checkOut > :start', { start, end })
      .getOne();
    return { available: !conflict };
  }

  private async validatePromo(code: string, userId: number, amount: number, nights: number): Promise<Promotion | null> {
    const promo = await this.promotionRepo.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });
    if (!promo) return null;
    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) return null;
    if (promo.maxUses && promo.usesCount >= promo.maxUses) return null;
    if (amount < promo.minBookingAmount) return null;
    if (nights < promo.minNights) return null;
    const usedCount = await this.redemptionRepo.count({ where: { promotionId: promo.id, userId } });
    if (usedCount >= promo.maxUsesPerUser) return null;
    return promo;
  }

  private calculatePromoDiscount(promo: Promotion, amount: number): number {
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = (amount * Number(promo.value)) / 100;
    } else if (promo.type === 'fixed') {
      discount = Number(promo.value);
    }
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = Number(promo.maxDiscount);
    }
    return Math.min(discount, amount);
  }
}

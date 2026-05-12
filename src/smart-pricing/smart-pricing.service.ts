import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';

@Injectable()
export class SmartPricingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  async getPriceSuggestion(propertyId: number, checkIn: string, checkOut: string): Promise<{
    suggestedPrice: number;
    basePrice: number;
    demandMultiplier: number;
    seasonMultiplier: number;
    weekendMultiplier: number;
    breakdown: Record<string, any>;
  } | null> {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) return null;

    const basePrice = Number(property.price || 50);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const seasonMultiplier = this.getSeasonMultiplier(checkInDate);
    const weekendMultiplier = this.getWeekendMultiplier(checkInDate, checkOutDate);
    const demandMultiplier = await this.getDemandMultiplier(propertyId, checkInDate, checkOutDate);

    const suggestedPrice = Math.round(basePrice * seasonMultiplier * weekendMultiplier * demandMultiplier);

    return {
      suggestedPrice,
      basePrice,
      demandMultiplier,
      seasonMultiplier,
      weekendMultiplier,
      breakdown: {
        season: this.getSeasonName(checkInDate),
        isWeekend: weekendMultiplier > 1,
        demandLevel: demandMultiplier > 1.1 ? 'High' : demandMultiplier > 0.9 ? 'Normal' : 'Low',
        minSuggested: Math.round(basePrice * 0.8),
        maxSuggested: Math.round(basePrice * 1.5),
      },
    };
  }

  async getCalendarPricing(propertyId: number, year: number, month: number): Promise<Record<string, number>> {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) return {};

    const basePrice = Number(property.price || 50);
    const daysInMonth = new Date(year, month, 0).getDate();
    const result: Record<string, number> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const seasonMult = this.getSeasonMultiplier(date);
      const weekendMult = date.getDay() === 0 || date.getDay() === 6 ? 1.25 : 1;
      result[dateStr] = Math.round(basePrice * seasonMult * weekendMult);
    }

    return result;
  }

  private getSeasonMultiplier(date: Date): number {
    const month = date.getMonth() + 1;
    if ([6, 7, 8].includes(month)) return 1.35; // Summer peak
    if ([12, 1].includes(month)) return 1.2;     // Winter holidays
    if ([3, 4, 5].includes(month)) return 1.1;   // Spring
    return 0.9;                                   // Fall shoulder season
  }

  private getSeasonName(date: Date): string {
    const month = date.getMonth() + 1;
    if ([6, 7, 8].includes(month)) return 'Summer (Peak)';
    if ([12, 1].includes(month)) return 'Winter Holidays';
    if ([3, 4, 5].includes(month)) return 'Spring';
    return 'Fall';
  }

  private getWeekendMultiplier(checkIn: Date, checkOut: Date): number {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    let weekendNights = 0;
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn);
      d.setDate(d.getDate() + i);
      if (d.getDay() === 5 || d.getDay() === 6) weekendNights++;
    }
    if (weekendNights === 0) return 1;
    return 1 + (weekendNights / nights) * 0.25;
  }

  private async getDemandMultiplier(propertyId: number, checkIn: Date, checkOut: Date): Promise<number> {
    const weekBefore = new Date(checkIn);
    weekBefore.setDate(weekBefore.getDate() - 7);
    const weekAfter = new Date(checkOut);
    weekAfter.setDate(weekAfter.getDate() + 7);

    const nearbyBookings = await this.bookingRepo.count({
      where: {
        propertyId,
        status: BookingStatus.CONFIRMED,
        checkIn: Between(weekBefore, weekAfter),
      },
    });

    if (nearbyBookings >= 3) return 1.15;
    if (nearbyBookings === 0) return 0.9;
    return 1;
  }
}

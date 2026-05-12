import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Property } from '../entities/property.entity';
import ical, { ICalCalendarMethod } from 'ical-generator';

@Injectable()
export class IcalService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  async generateHostCalendar(hostId: number, propertyId?: number): Promise<string> {
    const where: any = { hostId, status: BookingStatus.CONFIRMED };
    if (propertyId) where.propertyId = propertyId;

    const bookings = await this.bookingRepo.find({ where });
    const cal = ical({ name: 'Airbnb Clone Bookings', method: ICalCalendarMethod.PUBLISH });

    for (const booking of bookings) {
      const property = await this.propertyRepo.findOne({ where: { id: booking.propertyId } });
      const event = cal.createEvent({
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
        summary: property ? `Booking: ${property.title}` : `Booking #${booking.id}`,
        description: `Guests: ${booking.guests || 1}\nTotal: $${booking.totalPrice}\nBooking ID: ${booking.id}`,
        allDay: true,
      });
      event.uid(`booking-${booking.id}@airbnb-clone`);
    }

    return cal.toString();
  }

  async generateGuestCalendar(userId: number): Promise<string> {
    const bookings = await this.bookingRepo.find({
      where: { userId, status: BookingStatus.CONFIRMED },
    });

    const cal = ical({ name: 'My Airbnb Clone Trips', method: ICalCalendarMethod.PUBLISH });

    for (const booking of bookings) {
      const property = await this.propertyRepo.findOne({ where: { id: booking.propertyId } });
      const event = cal.createEvent({
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
        summary: property ? `Stay: ${property.title}` : `Booking #${booking.id}`,
        description: `${property?.location ?? ''}\nBooking ID: ${booking.id}`,
        allDay: true,
      });
      event.uid(`trip-${booking.id}@airbnb-clone`);
    }

    return cal.toString();
  }
}

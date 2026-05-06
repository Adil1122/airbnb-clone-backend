import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto, CancelBookingDto } from './bookings.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getGuestBookings(@Request() req) {
    return this.bookingsService.getGuestBookings(req.user.userId);
  }

  @Get('host')
  getHostBookings(@Request() req) {
    return this.bookingsService.getHostBookings(req.user.userId);
  }

  @Get('availability')
  checkAvailability(
    @Query('propertyId') propertyId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.bookingsService.checkDateAvailability(parseInt(propertyId), checkIn, checkOut);
  }

  @Get(':id')
  getOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.getOne(id, req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @Put(':id/confirm')
  confirm(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.confirmBooking(id, req.user.userId);
  }

  @Put(':id/decline')
  decline(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.declineBooking(id, req.user.userId);
  }

  @Put(':id/cancel')
  cancel(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: CancelBookingDto) {
    return this.bookingsService.cancel(id, req.user.userId, dto);
  }

  @Post('validate-promo')
  validatePromo(
    @Request() req,
    @Body() body: { code: string; amount: number; nights: number },
  ) {
    return this.bookingsService.validatePromoCode(body.code, req.user.userId, body.amount, body.nights);
  }
}

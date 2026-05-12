import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SmartPricingService } from './smart-pricing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('smart-pricing')
@UseGuards(JwtAuthGuard)
export class SmartPricingController {
  constructor(private readonly service: SmartPricingService) {}

  @Get(':propertyId/suggestion')
  getSuggestion(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.service.getPriceSuggestion(propertyId, checkIn, checkOut);
  }

  @Get(':propertyId/calendar')
  getCalendar(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.service.getCalendarPricing(propertyId, year, month);
  }
}

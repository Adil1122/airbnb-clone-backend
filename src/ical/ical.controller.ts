import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { IcalService } from './ical.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('ical')
@UseGuards(JwtAuthGuard)
export class IcalController {
  constructor(private readonly icalService: IcalService) {}

  @Get('host')
  async getHostCalendar(
    @CurrentUser() user: any,
    @Res() res: Response,
    @Query('propertyId') propertyId?: string,
  ) {
    const ics = await this.icalService.generateHostCalendar(
      user.id,
      propertyId ? parseInt(propertyId) : undefined,
    );
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="host-bookings.ics"');
    res.send(ics);
  }

  @Get('trips')
  async getGuestCalendar(@CurrentUser() user: any, @Res() res: Response) {
    const ics = await this.icalService.generateGuestCalendar(user.id);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="my-trips.ics"');
    res.send(ics);
  }
}

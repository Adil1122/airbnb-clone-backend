import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { RecentlyViewedService } from './recently-viewed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('recently-viewed')
@UseGuards(JwtAuthGuard)
export class RecentlyViewedController {
  constructor(private readonly service: RecentlyViewedService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.service.getRecentlyViewed(user.id);
  }

  @Post()
  track(@CurrentUser() user: any, @Body() body: { propertyId: number }) {
    return this.service.track(user.id, body.propertyId);
  }

  @Delete()
  clear(@CurrentUser() user: any) {
    return this.service.clear(user.id);
  }
}

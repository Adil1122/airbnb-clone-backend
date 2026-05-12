import { Controller, Get, UseGuards } from '@nestjs/common';
import { SuperhostService } from './superhost.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('superhost')
@UseGuards(JwtAuthGuard)
export class SuperhostController {
  constructor(private readonly service: SuperhostService) {}

  @Get('my-stats')
  getMyStats(@CurrentUser() user: any) {
    return this.service.getHostStats(user.id);
  }
}

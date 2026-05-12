import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CoHostsService } from './co-hosts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('co-hosts')
@UseGuards(JwtAuthGuard)
export class CoHostsController {
  constructor(private readonly coHostsService: CoHostsService) {}

  @Post('invite')
  invite(@CurrentUser() user: any, @Body() body: { propertyId: number; email: string; permissions: string[]; message?: string }) {
    return this.coHostsService.invite(user.id, body.propertyId, body.email, body.permissions, body.message);
  }

  @Post(':id/respond')
  respond(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Body() body: { accept: boolean }) {
    return this.coHostsService.respondToInvitation(user.id, id, body.accept);
  }

  @Get('invitations')
  getInvitations(@CurrentUser() user: any) {
    return this.coHostsService.getMyInvitations(user.id);
  }

  @Get('my-properties')
  getMyCoHostProperties(@CurrentUser() user: any) {
    return this.coHostsService.getMyCoHostProperties(user.id);
  }

  @Get('property/:propertyId')
  getPropertyCoHosts(@CurrentUser() user: any, @Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.coHostsService.getPropertyCoHosts(propertyId, user.id);
  }

  @Delete('property/:propertyId/user/:coHostId')
  remove(
    @CurrentUser() user: any,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('coHostId', ParseIntPipe) coHostId: number,
  ) {
    return this.coHostsService.remove(user.id, coHostId, propertyId);
  }
}

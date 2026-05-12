import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateNotificationPreferencesDto } from './notifications.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.notificationsService.getNotifications(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get('preferences')
  getPreferences(@Request() req: any) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @Put('preferences')
  updatePreferences(@Request() req: any, @Body() dto: UpdateNotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(req.user.id, dto);
  }

  @Put(':id/read')
  markRead(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Post('device-token')
  registerToken(@Request() req: any, @Body() body: { token: string; platform?: string }) {
    return this.notificationsService.registerDeviceToken(req.user.id, body.token, body.platform);
  }

  @Delete('device-token/:token')
  removeToken(@Param('token') token: string) {
    return this.notificationsService.removeDeviceToken(token);
  }
}

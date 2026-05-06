import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateNotificationPreferencesDto } from './notifications.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll(@Request() req) {
    return this.notificationsService.getNotifications(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Get('preferences')
  getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Put('preferences')
  updatePreferences(@Request() req, @Body() dto: UpdateNotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(req.user.userId, dto);
  }

  @Put(':id/read')
  markRead(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Post('read-all')
  markAllRead(@Request() req) {
    return this.notificationsService.markAllRead(req.user.userId);
  }
}

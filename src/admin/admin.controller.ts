import { Controller, Get, Post, Delete, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.service.getDashboard(user);
  }

  @Get('users')
  getUsers(@CurrentUser() user: any, @Query('page') page = '1', @Query('limit') limit = '20', @Query('search') search?: string) {
    return this.service.getUsers(user, parseInt(page), parseInt(limit), search);
  }

  @Post('users/:id/ban')
  banUser(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.banUser(user, id);
  }

  @Post('users/:id/unban')
  unbanUser(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.unbanUser(user, id);
  }

  @Post('users/:id/make-admin')
  makeAdmin(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.makeAdmin(user, id);
  }

  @Get('properties')
  getProperties(@CurrentUser() user: any, @Query('page') page = '1', @Query('limit') limit = '20', @Query('search') search?: string) {
    return this.service.getProperties(user, parseInt(page), parseInt(limit), search);
  }

  @Post('properties/:id/delist')
  delistProperty(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.delistProperty(user, id);
  }

  @Post('properties/:id/relist')
  relistProperty(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.relistProperty(user, id);
  }

  @Get('bookings')
  getBookings(@CurrentUser() user: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.getBookings(user, parseInt(page), parseInt(limit));
  }

  @Delete('reviews/:id')
  deleteReview(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteReview(user, id);
  }
}

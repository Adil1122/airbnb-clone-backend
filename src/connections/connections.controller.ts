import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private readonly service: ConnectionsService) {}

  @Post('request')
  sendRequest(@CurrentUser() user: any, @Body() body: { receiverId: number }) {
    return this.service.sendRequest(user.id, body.receiverId);
  }

  @Post(':id/respond')
  respond(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Body() body: { accept: boolean }) {
    return this.service.respond(user.id, id, body.accept);
  }

  @Get()
  getConnections(@CurrentUser() user: any) {
    return this.service.getConnections(user.id);
  }

  @Get('pending')
  getPending(@CurrentUser() user: any) {
    return this.service.getPendingRequests(user.id);
  }

  @Get('sent')
  getSent(@CurrentUser() user: any) {
    return this.service.getSentRequests(user.id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(user.id, id);
  }
}

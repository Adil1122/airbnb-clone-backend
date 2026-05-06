import { Controller, Get, Post, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateConversationDto, SendMessageDto } from './messages.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }

  @Get('conversations/:id')
  getMessages(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.messagesService.getMessages(id, req.user.userId);
  }

  @Post('conversations')
  createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    return this.messagesService.createConversation(req.user.userId, dto);
  }

  @Post('conversations/:id/send')
  sendMessage(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, req.user.userId, dto);
  }

  @Post('conversations/:id/read')
  markRead(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.messagesService.markAsRead(id, req.user.userId);
  }
}

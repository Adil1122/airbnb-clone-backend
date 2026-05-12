import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<number, string[]>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;

      const existing = this.userSockets.get(payload.sub) || [];
      this.userSockets.set(payload.sub, [...existing, client.id]);
      client.join(`user:${payload.sub}`);
      this.logger.log(`User ${payload.sub} connected: ${client.id}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const sockets = (this.userSockets.get(userId) || []).filter(id => id !== client.id);
      if (sockets.length) this.userSockets.set(userId, sockets);
      else this.userSockets.delete(userId);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: number }) {
    client.join(`conversation:${data.conversationId}`);
    return { event: 'joined', conversationId: data.conversationId };
  }

  @SubscribeMessage('leave_conversation')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: number }) {
    client.leave(`conversation:${data.conversationId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: number; isTyping: boolean }) {
    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      userId: client.data.userId,
      isTyping: data.isTyping,
    });
  }

  emitNewMessage(conversationId: number, message: any) {
    this.server.to(`conversation:${conversationId}`).emit('new_message', message);
  }

  emitNotification(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  emitBookingUpdate(userId: number, booking: any) {
    this.server.to(`user:${userId}`).emit('booking_update', booking);
  }

  isUserOnline(userId: number): boolean {
    return this.userSockets.has(userId);
  }
}

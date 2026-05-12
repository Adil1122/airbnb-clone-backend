import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or } from 'typeorm';
import { Connection, ConnectionStatus } from '../entities/connection.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection) private repo: Repository<Connection>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async sendRequest(requesterId: number, receiverId: number) {
    if (requesterId === receiverId) throw new ForbiddenException('Cannot connect with yourself');
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });
    if (!receiver) throw new NotFoundException('User not found');

    const existing = await this.repo.findOne({ where: { requesterId, receiverId } });
    if (existing) throw new ConflictException('Connection request already sent');

    const conn = await this.repo.save(this.repo.create({ requesterId, receiverId }));

    await this.notificationsService.push(
      receiverId, 'connection_request', 'New Connection Request',
      'Someone wants to connect with you', { requesterId: requesterId.toString() },
    );
    return conn;
  }

  async respond(userId: number, connectionId: number, accept: boolean) {
    const conn = await this.repo.findOne({ where: { id: connectionId, receiverId: userId } });
    if (!conn) throw new NotFoundException('Connection not found');
    conn.status = accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.BLOCKED;
    return this.repo.save(conn);
  }

  async getConnections(userId: number) {
    return this.repo.find({
      where: [
        { requesterId: userId, status: ConnectionStatus.ACCEPTED },
        { receiverId: userId, status: ConnectionStatus.ACCEPTED },
      ],
      relations: ['requester', 'receiver'],
    });
  }

  async getPendingRequests(userId: number) {
    return this.repo.find({
      where: { receiverId: userId, status: ConnectionStatus.PENDING },
      relations: ['requester'],
    });
  }

  async getSentRequests(userId: number) {
    return this.repo.find({
      where: { requesterId: userId, status: ConnectionStatus.PENDING },
      relations: ['receiver'],
    });
  }

  async remove(userId: number, connectionId: number) {
    const conn = await this.repo.findOne({
      where: [
        { id: connectionId, requesterId: userId },
        { id: connectionId, receiverId: userId },
      ],
    });
    if (!conn) throw new NotFoundException('Connection not found');
    await this.repo.remove(conn);
    return { success: true };
  }
}

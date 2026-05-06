import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationChannel } from '../entities/notification.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { UpdateNotificationPreferencesDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private prefRepo: Repository<NotificationPreference>,
  ) {}

  async getNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.notificationRepo.count({ where: { userId, isRead: false } });
    return { count };
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.notificationRepo.update({ id, userId }, { isRead: true, readAt: new Date() });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.notificationRepo.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
  }

  async getPreferences(userId: number): Promise<NotificationPreference> {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({ userId });
      pref = await this.prefRepo.save(pref);
    }
    return pref;
  }

  async updatePreferences(userId: number, dto: UpdateNotificationPreferencesDto): Promise<NotificationPreference> {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({ userId });
    }
    Object.assign(pref, dto);
    return this.prefRepo.save(pref);
  }

  async push(
    userId: number,
    type: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    channel: NotificationChannel = NotificationChannel.IN_APP,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId,
      type,
      title,
      body,
      data,
      channel,
      sentAt: new Date(),
    });
    return this.notificationRepo.save(notification);
  }
}

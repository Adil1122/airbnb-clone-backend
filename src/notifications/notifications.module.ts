import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { DeviceToken } from '../entities/device-token.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationPreference, DeviceToken]),
    FirebaseModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

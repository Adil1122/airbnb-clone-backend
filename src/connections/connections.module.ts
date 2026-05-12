import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from '../entities/connection.entity';
import { User } from '../entities/user.entity';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User]), NotificationsModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}

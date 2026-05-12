import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoHost } from '../entities/co-host.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { CoHostsService } from './co-hosts.service';
import { CoHostsController } from './co-hosts.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([CoHost, Property, User]), NotificationsModule],
  controllers: [CoHostsController],
  providers: [CoHostsService],
  exports: [CoHostsService],
})
export class CoHostsModule {}

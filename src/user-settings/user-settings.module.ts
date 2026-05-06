import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from '../entities/user-settings.entity';
import { User } from '../entities/user.entity';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings, User])],
  providers: [UserSettingsService],
  controllers: [UserSettingsController],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}

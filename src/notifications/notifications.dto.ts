import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { NotificationChannel } from '../entities/notification.entity';

export class UpdateNotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  bookingUpdatesEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  bookingUpdatesPush?: boolean;

  @IsBoolean()
  @IsOptional()
  bookingUpdatesSms?: boolean;

  @IsBoolean()
  @IsOptional()
  messagesEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  messagesPush?: boolean;

  @IsBoolean()
  @IsOptional()
  promotionsEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  promotionsPush?: boolean;

  @IsBoolean()
  @IsOptional()
  remindersEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  remindersPush?: boolean;
}

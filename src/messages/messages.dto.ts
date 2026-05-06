import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class CreateConversationDto {
  @IsNumber()
  listingId: number;

  @IsNumber()
  hostId: number;

  @IsNumber()
  @IsOptional()
  bookingId?: number;

  @IsString()
  initialMessage: string;
}

export class SendMessageDto {
  @IsString()
  body: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;
}

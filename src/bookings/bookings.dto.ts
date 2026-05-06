import { IsNumber, IsDateString, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { CancellationPolicy } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsNumber()
  propertyId: number;

  @IsNumber()
  hostId: number;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  numChildren?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  numInfants?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  numPets?: number;

  @IsNumber()
  propertyPrice: number;

  @IsNumber()
  @IsOptional()
  cleaningFee?: number;

  @IsNumber()
  @IsOptional()
  serviceFee?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(CancellationPolicy)
  @IsOptional()
  cancellationPolicy?: CancellationPolicy;

  @IsString()
  @IsOptional()
  messageToHost?: string;

  @IsString()
  @IsOptional()
  stripePaymentIntentId?: string;

  @IsString()
  @IsOptional()
  promoCode?: string;
}

export class CancelBookingDto {
  @IsString()
  @IsOptional()
  reason?: string;
}

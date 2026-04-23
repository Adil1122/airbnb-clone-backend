import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBasicsDto {
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateFloorPlanDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAdults?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxChildren?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxInfants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  beds?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePricingDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weekendPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weeklyDiscount?: number;
}

export class UpdatePoliciesDto {
  @IsBoolean()
  allowPets: boolean;

  @IsOptional()
  @IsString()
  houseRules?: string;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;
}

export class UpdateAmenitiesDto {
  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}

export class UpdateArrivalGuideDto {
  @IsOptional() @IsString() checkInMethod?: string;
  @IsOptional() @IsString() checkInInstructions?: string;
  @IsOptional() @IsString() wifiNetwork?: string;
  @IsOptional() @IsString() wifiPassword?: string;
  @IsOptional() @IsString() houseManual?: string;
  @IsOptional() @IsString() checkoutInstructions?: string;
  @IsOptional() @IsString() interactionPreference?: string;
}

export class UpdateCalendarDto {
  @IsString() date: string; // YYYY-MM-DD
  @IsOptional() @IsNumber() priceOverride?: number;
  @IsOptional() @IsBoolean() isAvailable?: boolean;
}


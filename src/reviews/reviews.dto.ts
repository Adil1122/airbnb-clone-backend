import { IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { ReviewType } from '../entities/review.entity';

export class CreateReviewDto {
  @IsNumber()
  propertyId: number;

  @IsNumber()
  @IsOptional()
  bookingId?: number;

  @IsEnum(ReviewType)
  @IsOptional()
  type?: ReviewType;

  @IsString()
  reviewText: string;

  @IsString()
  @IsOptional()
  privateFeedback?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  cleanlinessRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  accuracyRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  checkinRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  communicationRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  locationRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  valueRating?: number;
}

export class RespondToReviewDto {
  @IsString()
  response: string;
}

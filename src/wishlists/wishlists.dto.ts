import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}

export class UpdateWishlistDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}

export class AddWishlistItemDto {
  @IsNumber()
  propertyId: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}

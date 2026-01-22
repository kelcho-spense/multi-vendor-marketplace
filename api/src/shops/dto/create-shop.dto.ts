import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ShopStatus } from '../entities/shop.entity';
import type { ShopSettings } from '../entities/shop.entity';

export class CreateShopDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bannerUrl?: string;

  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @IsOptional()
  @IsObject()
  settings?: ShopSettings;
}

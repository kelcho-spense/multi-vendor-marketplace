import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  shopId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderPoint?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxStock?: number;
}

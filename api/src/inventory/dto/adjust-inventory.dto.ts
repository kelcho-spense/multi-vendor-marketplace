import { IsUUID, IsInt, IsEnum, IsOptional, IsString } from 'class-validator';
import { InventoryTransactionType } from '../entities/inventory.entity';

export class AdjustInventoryDto {
  @IsUUID()
  inventoryId: string;

  @IsEnum(InventoryTransactionType)
  type: InventoryTransactionType;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;
}

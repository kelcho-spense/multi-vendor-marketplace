import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ShopSupplierStatus } from '../entities/shop-supplier.entity';

export class CreateShopSupplierDto {
  @IsUUID()
  shopId: string;

  @IsUUID()
  supplierId: string;

  @IsOptional()
  @IsEnum(ShopSupplierStatus)
  status?: ShopSupplierStatus;
}

import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupplierOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSupplierOrderDto {
  @IsUUID()
  supplierId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierOrderItemDto)
  items: CreateSupplierOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

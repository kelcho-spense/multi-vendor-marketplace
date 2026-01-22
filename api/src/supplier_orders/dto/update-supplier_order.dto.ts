import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateSupplierOrderDto } from './create-supplier_order.dto';
import { SupplierOrderStatus } from '../entities/supplier_order.entity';

export class UpdateSupplierOrderDto extends PartialType(
  CreateSupplierOrderDto,
) {
  @IsOptional()
  @IsEnum(SupplierOrderStatus)
  status?: SupplierOrderStatus;
}

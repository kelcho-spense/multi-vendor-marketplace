import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierOrderItemDto } from './create-supplier-order-item.dto';

export class UpdateSupplierOrderItemDto extends PartialType(
  CreateSupplierOrderItemDto,
) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateShopSupplierDto } from './create-shop-supplier.dto';

export class UpdateShopSupplierDto extends PartialType(CreateShopSupplierDto) {}

import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateSupplierOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}

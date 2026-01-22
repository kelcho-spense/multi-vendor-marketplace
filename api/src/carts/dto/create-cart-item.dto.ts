import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}

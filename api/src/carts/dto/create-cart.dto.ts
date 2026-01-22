import { IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsUUID()
  shopId: string;
}

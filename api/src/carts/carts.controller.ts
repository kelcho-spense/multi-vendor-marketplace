import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Auth, CurrentUser } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Auth({ permissions: [Permission.CART_UPDATE] })
  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartsService.create(userId, createCartDto);
  }

  @Auth({ permissions: [Permission.CART_READ] })
  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Auth({ permissions: [Permission.CART_READ] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(id);
  }

  @Auth({ permissions: [Permission.CART_UPDATE] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(id, updateCartDto);
  }

  @Auth({ permissions: [Permission.CART_UPDATE] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}

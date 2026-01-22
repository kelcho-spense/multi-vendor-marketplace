import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth, CurrentUser } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';
import { UserRole } from '../common/enums/user.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth({ permissions: [Permission.ORDER_CREATE] })
  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Auth({ permissions: [Permission.ORDER_READ] })
  @Get()
  findAll(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.ordersService.findAllForUser(userId, role);
  }

  @Auth({ permissions: [Permission.ORDER_READ] })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.ordersService.findOneForUser(id, userId, role);
  }

  @Auth({ permissions: [Permission.ORDER_UPDATE] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Auth({ permissions: [Permission.ORDER_CANCEL] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupplierOrdersService } from './supplier_orders.service';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';
import { Auth } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly supplierOrdersService: SupplierOrdersService) {}

  @Auth({ permissions: [Permission.SUPPLIER_ORDER_CREATE] })
  @Post()
  create(@Body() createSupplierOrderDto: CreateSupplierOrderDto) {
    const shopId = 'placeholder-shop-id'; // TODO: Get from shop context
    return this.supplierOrdersService.create(shopId, createSupplierOrderDto);
  }

  @Auth({ permissions: [Permission.SUPPLIER_READ] })
  @Get()
  findAll() {
    return this.supplierOrdersService.findAll();
  }

  @Auth({ permissions: [Permission.SUPPLIER_READ] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierOrdersService.findOne(id);
  }

  @Auth({ permissions: [Permission.SUPPLIER_ORDER_UPDATE] })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierOrderDto: UpdateSupplierOrderDto,
  ) {
    return this.supplierOrdersService.update(id, updateSupplierOrderDto);
  }

  @Auth({ permissions: [Permission.SUPPLIER_ORDER_UPDATE] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierOrdersService.remove(id);
  }
}

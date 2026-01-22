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

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly supplierOrdersService: SupplierOrdersService) {}

  @Post()
  create(@Body() createSupplierOrderDto: CreateSupplierOrderDto) {
    const shopId = 'placeholder-shop-id'; // TODO: Get from auth context
    return this.supplierOrdersService.create(shopId, createSupplierOrderDto);
  }

  @Get()
  findAll() {
    return this.supplierOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierOrdersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierOrderDto: UpdateSupplierOrderDto,
  ) {
    return this.supplierOrdersService.update(id, updateSupplierOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierOrdersService.remove(id);
  }
}

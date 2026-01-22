import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  getLowStock(@Query('shopId') shopId?: string) {
    return this.inventoryService.getLowStockItems(shopId);
  }

  @Get('reorder')
  getReorderItems(@Query('shopId') shopId?: string) {
    return this.inventoryService.getReorderItems(shopId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Get('shop/:shopId')
  findByShop(@Param('shopId') shopId: string) {
    return this.inventoryService.findByShop(shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Get(':id/transactions')
  getTransactionHistory(@Param('id') id: string) {
    return this.inventoryService.getTransactionHistory(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Post('adjust')
  adjustStock(@Body() adjustInventoryDto: AdjustInventoryDto) {
    return this.inventoryService.adjustStock(adjustInventoryDto);
  }

  @Post(':id/reserve')
  reserveStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.inventoryService.reserveStock(id, quantity);
  }

  @Post(':id/release')
  releaseReservedStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.releaseReservedStock(id, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}

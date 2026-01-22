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
import { Auth } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get('low-stock')
  getLowStock(@Query('shopId') shopId?: string) {
    return this.inventoryService.getLowStockItems(shopId);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get('reorder')
  getReorderItems(@Query('shopId') shopId?: string) {
    return this.inventoryService.getReorderItems(shopId);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get('shop/:shopId')
  findByShop(@Param('shopId') shopId: string) {
    return this.inventoryService.findByShop(shopId);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Auth({ permissions: [Permission.INVENTORY_READ] })
  @Get(':id/transactions')
  getTransactionHistory(@Param('id') id: string) {
    return this.inventoryService.getTransactionHistory(id);
  }

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Post('adjust')
  adjustStock(@Body() adjustInventoryDto: AdjustInventoryDto) {
    return this.inventoryService.adjustStock(adjustInventoryDto);
  }

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Post(':id/reserve')
  reserveStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.inventoryService.reserveStock(id, quantity);
  }

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Post(':id/release')
  releaseReservedStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.releaseReservedStock(id, quantity);
  }

  @Auth({ permissions: [Permission.INVENTORY_UPDATE] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}

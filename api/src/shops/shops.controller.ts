import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Auth, Public, CurrentUser } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Auth({ permissions: [Permission.SHOP_CREATE] })
  @Post()
  create(
    @CurrentUser('userId') ownerId: string,
    @Body() createShopDto: CreateShopDto,
  ) {
    return this.shopsService.create(ownerId, createShopDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Auth({ permissions: [Permission.SHOP_UPDATE] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Auth({ permissions: [Permission.SHOP_DELETE] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}

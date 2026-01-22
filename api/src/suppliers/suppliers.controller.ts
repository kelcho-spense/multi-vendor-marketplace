import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Auth, CurrentUser } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Auth({ permissions: [Permission.SUPPLIER_CREATE] })
  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() createSupplierDto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(userId, createSupplierDto);
  }

  @Auth({ permissions: [Permission.SUPPLIER_READ] })
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Auth({ permissions: [Permission.SUPPLIER_READ] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @Auth({ permissions: [Permission.SUPPLIER_UPDATE] })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Auth({ permissions: [Permission.SUPPLIER_DELETE] })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}

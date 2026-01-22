import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierOrdersService } from './supplier_orders.service';
import { SupplierOrdersController } from './supplier_orders.controller';
import { SupplierOrder } from './entities/supplier_order.entity';
import { SupplierOrderItem } from './entities/supplier-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierOrder, SupplierOrderItem])],
  controllers: [SupplierOrdersController],
  providers: [SupplierOrdersService],
  exports: [SupplierOrdersService],
})
export class SupplierOrdersModule {}

import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { SupplierOrderItem } from './supplier-order-item.entity';
import { SupplierOrderStatus } from '../../common/enums';

export { SupplierOrderStatus };

@Entity('supplier_orders')
export class SupplierOrder extends BaseEntity {
  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: SupplierOrderStatus,
    default: SupplierOrderStatus.PENDING,
  })
  status: SupplierOrderStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Relationships

  @ManyToOne(() => Shop, (shop) => shop.supplierOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplierOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => SupplierOrderItem, (item) => item.order, { cascade: true })
  items: SupplierOrderItem[];

  @BeforeInsert()
  generateOrderNumber() {
    if (!this.orderNumber) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.orderNumber = `SUP-${timestamp}-${random}`;
    }
  }
}

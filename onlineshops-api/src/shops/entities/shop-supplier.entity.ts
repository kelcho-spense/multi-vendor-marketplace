import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Shop } from './shop.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

export enum ShopSupplierStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('shop_suppliers')
@Unique(['shopId', 'supplierId']) // One relationship per shop-supplier pair
export class ShopSupplier extends BaseEntity {
  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @Column({
    type: 'enum',
    enum: ShopSupplierStatus,
    default: ShopSupplierStatus.PENDING,
  })
  status: ShopSupplierStatus;

  // Relationships

  @ManyToOne(() => Shop, (shop) => shop.shopSuppliers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.shopSuppliers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
}

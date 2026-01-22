import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { SupplierProduct } from './supplier-product.entity';
import { ShopSupplier } from '../../shops/entities/shop-supplier.entity';
import { SupplierOrder } from '../../supplier_orders/entities/supplier_order.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'contact_email', type: 'varchar', length: 255 })
  contactEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  rating: number;

  // Relationships

  @OneToOne(() => User, (user) => user.supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SupplierProduct, (product) => product.supplier)
  products: SupplierProduct[];

  @OneToMany(() => ShopSupplier, (shopSupplier) => shopSupplier.supplier)
  shopSuppliers: ShopSupplier[];

  @OneToMany(() => SupplierOrder, (order) => order.supplier)
  supplierOrders: SupplierOrder[];
}

import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ShopSupplier } from './shop-supplier.entity';
import { SupplierOrder } from '../../supplier_orders/entities/supplier_order.entity';

export enum ShopStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export interface ShopSettings {
  currency?: string;
  timezone?: string;
  orderNotifications?: boolean;
  autoAcceptOrders?: boolean;
  minimumOrderAmount?: number;
}

@Entity('shops')
export class Shop extends BaseEntity {
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'banner_url', type: 'varchar', length: 500, nullable: true })
  bannerUrl: string | null;

  @Column({
    type: 'enum',
    enum: ShopStatus,
    default: ShopStatus.PENDING,
  })
  status: ShopStatus;

  @Column({ type: 'jsonb', nullable: true })
  settings: ShopSettings | null;

  // Relationships

  @ManyToOne(() => User, (user) => user.shops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @OneToMany(() => Order, (order) => order.shop)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.shop)
  carts: Cart[];

  @OneToMany(() => Review, (review) => review.shop)
  reviews: Review[];

  @OneToMany(() => ShopSupplier, (shopSupplier) => shopSupplier.shop)
  shopSuppliers: ShopSupplier[];

  @OneToMany(() => SupplierOrder, (supplierOrder) => supplierOrder.shop)
  supplierOrders: SupplierOrder[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name && !this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
}

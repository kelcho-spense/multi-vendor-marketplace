import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { InventoryTransactionType } from '../../common/enums';

export { InventoryTransactionType };

@Entity('inventory')
@Index(['productId', 'shopId'])
export class Inventory extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'reserved_quantity', type: 'int', default: 0 })
  reservedQuantity: number;

  @Column({ name: 'low_stock_threshold', type: 'int', default: 10 })
  lowStockThreshold: number;

  @Column({ name: 'reorder_point', type: 'int', default: 20 })
  reorderPoint: number;

  @Column({ name: 'max_stock', type: 'int', nullable: true })
  maxStock: number | null;

  @Column({ name: 'last_restocked_at', type: 'timestamp', nullable: true })
  lastRestockedAt: Date | null;

  // Relationships

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Shop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  // Computed properties
  get availableQuantity(): number {
    return this.quantity - this.reservedQuantity;
  }

  get isLowStock(): boolean {
    return this.availableQuantity <= this.lowStockThreshold;
  }

  get needsReorder(): boolean {
    return this.availableQuantity <= this.reorderPoint;
  }
}

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Supplier } from './supplier.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('supplier_products')
export class SupplierProduct extends BaseEntity {
  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'wholesale_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  wholesalePrice: number;

  @Column({ name: 'min_order_qty', type: 'int', default: 1 })
  minOrderQty: number;

  @Column({ name: 'stock_qty', type: 'int', default: 0 })
  stockQty: number;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  images: string[] | null;

  // Relationships

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;
}

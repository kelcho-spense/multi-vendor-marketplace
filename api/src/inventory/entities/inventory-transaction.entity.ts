import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Inventory, InventoryTransactionType } from './inventory.entity';
import { User } from '../../users/entities/user.entity';

@Entity('inventory_transactions')
@Index(['inventoryId', 'createdAt'])
export class InventoryTransaction extends BaseEntity {
  @Column({ name: 'inventory_id', type: 'uuid' })
  inventoryId: string;

  @Column({
    type: 'enum',
    enum: InventoryTransactionType,
  })
  type: InventoryTransactionType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'previous_quantity', type: 'int' })
  previousQuantity: number;

  @Column({ name: 'new_quantity', type: 'int' })
  newQuantity: number;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({
    name: 'reference_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  referenceId: string | null;

  @Column({ name: 'performed_by', type: 'uuid', nullable: true })
  performedBy: string | null;

  // Relationships

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'performed_by' })
  user: User;
}

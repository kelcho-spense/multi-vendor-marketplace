import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { UserAddress } from './user-address.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum UserRole {
  SHOPPER = 'shopper',
  SHOP_OWNER = 'shop_owner',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SHOPPER,
  })
  role: UserRole;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  // Relationships

  @OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
  addresses: UserAddress[];

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops: Shop[];

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier: Supplier;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  // Computed property
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}

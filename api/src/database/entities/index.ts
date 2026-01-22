// Export all entities from this file
// This makes imports cleaner: import { User, Shop } from '@database/entities';

export * from './base.entity';

// User entities
export * from '../../users/entities/user.entity';
export * from '../../users/entities/user-address.entity';

// Shop entities
export * from '../../shops/entities/shop.entity';
export * from '../../shops/entities/shop-supplier.entity';

// Supplier entities
export * from '../../suppliers/entities/supplier.entity';
export * from '../../suppliers/entities/supplier-product.entity';

// Category entities
export * from '../../categories/entities/category.entity';

// Product entities
export * from '../../products/entities/product.entity';

// Order entities
export * from '../../orders/entities/order.entity';
export * from '../../orders/entities/order-item.entity';

// Cart entities
export * from '../../carts/entities/cart.entity';
export * from '../../carts/entities/cart-item.entity';

// Review entities
export * from '../../reviews/entities/review.entity';

// Supplier order entities
export * from '../../supplier_orders/entities/supplier_order.entity';
export * from '../../supplier_orders/entities/supplier-order-item.entity';

// Inventory entities
export * from '../../inventory/entities/inventory.entity';
export * from '../../inventory/entities/inventory-transaction.entity';

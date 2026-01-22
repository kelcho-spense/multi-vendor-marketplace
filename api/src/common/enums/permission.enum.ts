// Permission-based access control enums

export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Shop permissions
  SHOP_READ = 'shop:read',
  SHOP_CREATE = 'shop:create',
  SHOP_UPDATE = 'shop:update',
  SHOP_DELETE = 'shop:delete',
  SHOP_MANAGE_STAFF = 'shop:manage_staff',

  // Product permissions
  PRODUCT_READ = 'product:read',
  PRODUCT_CREATE = 'product:create',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',

  // Order permissions
  ORDER_READ = 'order:read',
  ORDER_CREATE = 'order:create',
  ORDER_UPDATE = 'order:update',
  ORDER_CANCEL = 'order:cancel',

  // Cart permissions
  CART_READ = 'cart:read',
  CART_UPDATE = 'cart:update',

  // Review permissions
  REVIEW_READ = 'review:read',
  REVIEW_CREATE = 'review:create',
  REVIEW_UPDATE = 'review:update',
  REVIEW_DELETE = 'review:delete',

  // Supplier permissions
  SUPPLIER_READ = 'supplier:read',
  SUPPLIER_CREATE = 'supplier:create',
  SUPPLIER_UPDATE = 'supplier:update',
  SUPPLIER_DELETE = 'supplier:delete',
  SUPPLIER_ORDER_CREATE = 'supplier_order:create',
  SUPPLIER_ORDER_UPDATE = 'supplier_order:update',

  // Inventory permissions
  INVENTORY_READ = 'inventory:read',
  INVENTORY_UPDATE = 'inventory:update',

  // Analytics permissions
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',

  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_MANAGE_USERS = 'admin:manage_users',
  ADMIN_MANAGE_SHOPS = 'admin:manage_shops',
  ADMIN_VIEW_ALL_ORDERS = 'admin:view_all_orders',
}

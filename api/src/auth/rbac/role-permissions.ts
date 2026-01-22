import { UserRole } from '../../common/enums/user.enum';
import { Permission } from '../../common/enums/permission.enum';

/**
 * Maps each role to its allowed permissions
 * Permissions are additive - each role has its own set
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SHOPPER]: [
    // Browse and shop
    Permission.PRODUCT_READ,
    Permission.SHOP_READ,
    Permission.REVIEW_READ,

    // Cart operations
    Permission.CART_READ,
    Permission.CART_UPDATE,

    // Order operations
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
    Permission.ORDER_CANCEL,

    // Reviews
    Permission.REVIEW_CREATE,
    Permission.REVIEW_UPDATE,

    // Own profile
    Permission.USER_READ,
    Permission.USER_UPDATE,
  ],

  [UserRole.SHOP_OWNER]: [
    // All shopper permissions
    Permission.PRODUCT_READ,
    Permission.SHOP_READ,
    Permission.REVIEW_READ,
    Permission.CART_READ,
    Permission.CART_UPDATE,
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
    Permission.ORDER_CANCEL,
    Permission.REVIEW_CREATE,
    Permission.REVIEW_UPDATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,

    // Shop management
    Permission.SHOP_CREATE,
    Permission.SHOP_UPDATE,
    Permission.SHOP_MANAGE_STAFF,

    // Product management
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,

    // Order management (for their shop)
    Permission.ORDER_UPDATE,

    // Inventory
    Permission.INVENTORY_READ,
    Permission.INVENTORY_UPDATE,

    // Supplier relations
    Permission.SUPPLIER_READ,
    Permission.SUPPLIER_ORDER_CREATE,
    Permission.SUPPLIER_ORDER_UPDATE,

    // Analytics (own shop)
    Permission.ANALYTICS_READ,
  ],

  [UserRole.SUPPLIER]: [
    // Basic access
    Permission.PRODUCT_READ,
    Permission.SHOP_READ,
    Permission.USER_READ,
    Permission.USER_UPDATE,

    // Supplier-specific
    Permission.SUPPLIER_READ,
    Permission.SUPPLIER_UPDATE,

    // Product catalog management
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,

    // Inventory
    Permission.INVENTORY_READ,
    Permission.INVENTORY_UPDATE,

    // Order fulfillment
    Permission.SUPPLIER_ORDER_UPDATE,

    // Analytics
    Permission.ANALYTICS_READ,
  ],

  [UserRole.ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return RolePermissions[role] ?? [];
}

import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../common/enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to require specific permissions for a route
 * User must have ALL specified permissions
 * @example
 * @RequirePermissions(Permission.SHOP_UPDATE, Permission.PRODUCT_CREATE)
 * @Put(':id')
 * updateShop() { ... }
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

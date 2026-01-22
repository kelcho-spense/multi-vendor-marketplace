import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../../common/enums/user.enum';
import { Permission } from '../../common/enums/permission.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Roles } from './roles.decorator';
import { RequirePermissions } from './permissions.decorator';

/**
 * Combined auth decorator - applies JWT auth and optionally roles/permissions
 * @example
 * // Just require authentication
 * @Auth()
 *
 * // Require specific roles
 * @Auth({ roles: [UserRole.ADMIN, UserRole.SHOP_OWNER] })
 *
 * // Require specific permissions
 * @Auth({ permissions: [Permission.SHOP_UPDATE] })
 *
 * // Require both roles and permissions
 * @Auth({ roles: [UserRole.SHOP_OWNER], permissions: [Permission.PRODUCT_CREATE] })
 */
export function Auth(options?: {
  roles?: UserRole[];
  permissions?: Permission[];
}) {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    UseGuards(JwtAuthGuard),
  ];

  if (options?.roles && options.roles.length > 0) {
    decorators.push(UseGuards(RolesGuard), Roles(...options.roles));
  }

  if (options?.permissions && options.permissions.length > 0) {
    decorators.push(
      UseGuards(PermissionsGuard),
      RequirePermissions(...options.permissions),
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Shorthand for admin-only routes
 */
export const AdminOnly = () => Auth({ roles: [UserRole.ADMIN] });

/**
 * Shorthand for shop owner routes
 */
export const ShopOwnerOnly = () =>
  Auth({ roles: [UserRole.SHOP_OWNER, UserRole.ADMIN] });

/**
 * Shorthand for supplier routes
 */
export const SupplierOnly = () =>
  Auth({ roles: [UserRole.SUPPLIER, UserRole.ADMIN] });

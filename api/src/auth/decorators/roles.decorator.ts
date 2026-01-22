import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator to require specific roles for a route
 * User must have ONE of the specified roles
 * @example
 * @Roles(UserRole.ADMIN, UserRole.SHOP_OWNER)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('dashboard')
 * getDashboard() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

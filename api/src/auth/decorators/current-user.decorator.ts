import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../common/enums/user.enum';

/**
 * Represents the authenticated user payload from JWT
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Parameter decorator to extract the authenticated user from the request
 * @param data - Optional property key to extract from the user object
 * @example
 * // Get entire user object
 * @CurrentUser() user: AuthenticatedUser
 *
 * // Get specific property
 * @CurrentUser('userId') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

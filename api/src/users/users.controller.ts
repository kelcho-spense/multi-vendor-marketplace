import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { Auth, AdminOnly, CurrentUser } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';
import { UserRole } from '../common/enums/user.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @AdminOnly()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AdminOnly()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth({ permissions: [Permission.USER_READ] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Auth({ permissions: [Permission.USER_UPDATE] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ==================== Address Endpoints ====================

  /**
   * Verify the current user can access the target user's addresses
   * Users can only access their own addresses; admins can access any
   */
  private verifyAddressAccess(
    targetUserId: string,
    currentUserId: string,
    currentRole: UserRole,
  ): void {
    if (currentRole !== UserRole.ADMIN && targetUserId !== currentUserId) {
      throw new ForbiddenException(
        'You can only access your own addresses',
      );
    }
  }

  @Auth({ permissions: [Permission.USER_READ] })
  @Get(':id/addresses')
  findAddresses(
    @Param('id') id: string,
    @CurrentUser('userId') currentUserId: string,
    @CurrentUser('role') currentRole: UserRole,
  ) {
    this.verifyAddressAccess(id, currentUserId, currentRole);
    return this.usersService.findUserAddresses(id);
  }

  @Auth({ permissions: [Permission.USER_UPDATE] })
  @Post(':id/addresses')
  createAddress(
    @Param('id') id: string,
    @Body() createAddressDto: CreateUserAddressDto,
    @CurrentUser('userId') currentUserId: string,
    @CurrentUser('role') currentRole: UserRole,
  ) {
    this.verifyAddressAccess(id, currentUserId, currentRole);
    return this.usersService.createAddress(id, createAddressDto);
  }

  @Auth({ permissions: [Permission.USER_UPDATE] })
  @Patch(':id/addresses/:addressId')
  updateAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateUserAddressDto,
    @CurrentUser('userId') currentUserId: string,
    @CurrentUser('role') currentRole: UserRole,
  ) {
    this.verifyAddressAccess(id, currentUserId, currentRole);
    return this.usersService.updateAddress(id, addressId, updateAddressDto);
  }

  @Auth({ permissions: [Permission.USER_UPDATE] })
  @Delete(':id/addresses/:addressId')
  removeAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @CurrentUser('userId') currentUserId: string,
    @CurrentUser('role') currentRole: UserRole,
  ) {
    this.verifyAddressAccess(id, currentUserId, currentRole);
    return this.usersService.removeAddress(id, addressId);
  }
}

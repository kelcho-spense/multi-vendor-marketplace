import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, AdminOnly } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}

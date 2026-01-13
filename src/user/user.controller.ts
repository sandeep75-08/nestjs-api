import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AddUserDTO, GetAllUsersDTO, UpdateUserDTO } from './dto';
import { UserService } from './user.service';
import { User } from 'generated/prisma/browser';
import { PermissionGuard } from 'src/auth/guards';
import { RequirePermission } from 'src/auth/decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  @RequirePermission('users', 'read')
  getAllUsers(@Body() body: GetAllUsersDTO, @Req() req: Request) {
    return this.userService.getAllUsers(body, (req.user as User)?.id);
  }

  @Get('/me')
  @RequirePermission('users', 'read')
  getUser(@Req() req: Request) {
    return req.user;
  }

  @Post('add')
  @RequirePermission('users', 'write')
  addUser(@Body() body: AddUserDTO) {
    return this.userService.addUser(body);
  }

  @Put('update/:id')
  @RequirePermission('users', 'update')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }

  @Delete('delete/:id')
  @RequirePermission('users', 'delete')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}

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
import { ModulesGuard } from 'src/auth/guards';
import { Modules } from 'src/auth/decorator';
import { User } from 'generated/prisma/browser';

@Controller('users')
@UseGuards(AuthGuard('jwt'), ModulesGuard)
@Modules('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  getAllUsers(@Body() body: GetAllUsersDTO, @Req() req: Request) {
    return this.userService.getAllUsers(body, (req.user as User)?.id);
  }

  @Get('/me')
  getUser(@Req() req: Request) {
    return req.user;
  }

  @Post('add')
  addUser(@Body() body: AddUserDTO) {
    return this.userService.addUser(body);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}

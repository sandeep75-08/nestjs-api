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

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  getAllUsers(@Body() body: GetAllUsersDTO) {
    return this.userService.getAllUsers(body);
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

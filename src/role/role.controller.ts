import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDTO, GetAllRolesDTO } from './dto';
import { RoleService } from './role.service';
import { UpdateModuleDTO } from 'src/module/dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  getAllRoles(@Body() body: GetAllRolesDTO) {
    return this.roleService.getAllRoles(body);
  }

  @Get(':id')
  findRole(@Param('id') id: number) {
    return this.roleService.findRole(id);
  }

  @Post('/add')
  createRole(@Body() body: CreateRoleDTO) {
    return this.roleService.createRole(body);
  }

  @Put('/update/:id')
  updateRole(@Param('id') id: number, @Body() body: UpdateModuleDTO) {
    return this.roleService.updateRole(id, body);
  }

  @Delete('/delete/:id')
  deleteRole(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }
}

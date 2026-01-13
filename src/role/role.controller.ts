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
import { CreateRoleDTO, GetAllRolesDTO, UpdateRoleDTO } from './dto';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/guards';
import { RequirePermission } from 'src/auth/decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @RequirePermission('roles', 'read')
  getAllRoles(@Body() body: GetAllRolesDTO) {
    return this.roleService.getAllRoles(body);
  }

  @Get(':id')
  @RequirePermission('roles', 'read')
  findRole(@Param('id') id: number) {
    return this.roleService.findRole(id);
  }

  @Post('/add')
  @RequirePermission('roles', 'write')
  createRole(@Body() body: CreateRoleDTO) {
    return this.roleService.createRole(body);
  }

  @Put('/update/:id')
  @RequirePermission('roles', 'update')
  updateRole(@Param('id') id: number, @Body() body: UpdateRoleDTO) {
    return this.roleService.updateRole(id, body);
  }

  @Delete('/delete/:id')
  @RequirePermission('roles', 'delete')
  deleteRole(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }
}

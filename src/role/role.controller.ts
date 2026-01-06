import { Body, Controller, Get } from '@nestjs/common';
import { getAllRolesDTO } from './dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  signup(@Body() body: getAllRolesDTO) {
    return this.roleService.getAllRoles(body);
  }
}

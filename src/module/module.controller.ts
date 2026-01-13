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
import {
  CreateModuleDTO,
  GetAllModulesDTO,
  UpdateModuleDTO,
} from 'src/module/dto';
import { AuthGuard } from '@nestjs/passport';
import { ModuleService } from './module.service';
import { PermissionGuard } from 'src/auth/guards';
import { RequirePermission } from 'src/auth/decorator';

@Controller('modules')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class ModuleController {
  constructor(private moduleService: ModuleService) {}

  @Post()
  @RequirePermission('modules', 'read')
  getAllModules(@Body() body: GetAllModulesDTO) {
    return this.moduleService.getAllModules(body);
  }

  @Get(':id')
  @RequirePermission('modules', 'read')
  findModule(@Param('id') id: number) {
    return this.moduleService.findModule(id);
  }

  @Post('/add')
  @RequirePermission('modules', 'write')
  createModule(@Body() body: CreateModuleDTO) {
    return this.moduleService.createModule(body);
  }

  @Put('/update/:id')
  @RequirePermission('modules', 'update')
  updateRole(@Param('id') id: number, @Body() body: UpdateModuleDTO) {
    return this.moduleService.updateModule(id, body);
  }

  @Delete('/delete/:id')
  @RequirePermission('modules', 'delete')
  deleteRole(@Param('id') id: number) {
    return this.moduleService.deleteModule(id);
  }
}

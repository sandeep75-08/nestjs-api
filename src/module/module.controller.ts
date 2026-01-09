import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  //   UseGuards,
} from '@nestjs/common';
import {
  CreateModuleDTO,
  GetAllModulesDTO,
  UpdateModuleDTO,
} from 'src/module/dto';
// import { AuthGuard } from '@nestjs/passport';
import { ModuleService } from './module.service';

@Controller('modules')
// @UseGuards(AuthGuard('jwt'))
export class ModuleController {
  constructor(private moduleService: ModuleService) {}

  @Post()
  getAllModules(@Body() body: GetAllModulesDTO) {
    return this.moduleService.getAllModules(body);
  }

  @Get(':id')
  findModule(@Param('id') id: number) {
    return this.moduleService.findModule(id);
  }

  @Post('/add')
  createModule(@Body() body: CreateModuleDTO) {
    return this.moduleService.createModule(body);
  }

  @Put('/update/:id')
  updateRole(@Param('id') id: number, @Body() body: UpdateModuleDTO) {
    return this.moduleService.updateModule(id, body);
  }

  @Delete('/delete/:id')
  deleteRole(@Param('id') id: number) {
    return this.moduleService.deleteModule(id);
  }
}

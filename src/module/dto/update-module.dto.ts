import { IsArray, IsOptional, IsString } from 'class-validator';
import { ModulePermissions } from 'types';

export class UpdateModuleDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  permissions?: ModulePermissions[];
}

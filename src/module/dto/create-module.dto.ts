import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ModulePermissions } from 'types';

export class CreateModuleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  permissions?: ModulePermissions[];
}

import { IsArray, IsOptional, IsString } from 'class-validator';
import { RolePermissions } from 'types';

export class UpdateRoleDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  permissions?: RolePermissions[];
}

import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { RolePermissions } from 'types';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  permissions?: RolePermissions[];
}

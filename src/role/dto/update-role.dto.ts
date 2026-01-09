import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  moduleIds?: number[];
}

import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateModuleDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roleIds?: number[];
}

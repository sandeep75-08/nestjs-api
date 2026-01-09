import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  moduleIds?: number[];
}

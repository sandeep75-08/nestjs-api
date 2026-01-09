import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetAllModulesDTO {
  @IsString()
  search: string;

  @IsInt()
  @IsNotEmpty()
  page: number;

  @IsInt()
  @IsNotEmpty()
  limit: number;
}

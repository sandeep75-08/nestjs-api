import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class getAllRolesDTO {
  @IsString()
  search: string;

  @IsInt()
  @IsNotEmpty()
  page: number;

  @IsInt()
  @IsNotEmpty()
  limit: number;
}

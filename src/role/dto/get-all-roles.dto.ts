import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetAllRolesDTO {
  @IsString()
  search: string;

  @IsInt()
  @IsNotEmpty()
  page: number;

  @IsInt()
  @IsNotEmpty()
  limit: number;
}

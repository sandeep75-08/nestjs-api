import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsOptional,
} from 'class-validator';

export class GetAllUsersDTO {
  @IsString()
  search: string;

  @IsInt()
  @IsNotEmpty()
  page: number;

  @IsInt()
  @IsNotEmpty()
  limit: number;
}

export class AddUserDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @IsOptional()
  roleId?: number | null;
}

export class UpdateUserDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}

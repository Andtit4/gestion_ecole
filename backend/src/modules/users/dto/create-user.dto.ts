import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus, Permission } from '../schemas/user.schema';

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: Permission[];

  // Champs spécifiques selon le rôle
  @IsString()
  @IsOptional()
  department?: string; // Pour les professeurs et admins

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[]; // Pour les professeurs

  @IsString()
  @IsOptional()
  class?: string; // Pour les élèves

  @IsString()
  @IsOptional()
  studentNumber?: string; // Pour les élèves

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  parentIds?: string[]; // Pour les élèves

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  childrenIds?: string[]; // Pour les parents
} 
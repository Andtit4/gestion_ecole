import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsNumber, IsDateString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

class EmergencyContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  relationship?: string;
}

export class CreateTeacherDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsOptional()
  @IsString()
  placeOfBirth?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsDateString()
  hireDate: string;

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classes?: string[];

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experience?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
} 
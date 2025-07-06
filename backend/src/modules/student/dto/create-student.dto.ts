import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;
}

class ParentContactDto {
  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  fatherPhone?: string;

  @IsOptional()
  @IsEmail()
  fatherEmail?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  motherPhone?: string;

  @IsOptional()
  @IsEmail()
  motherEmail?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;
}

class AcademicInfoDto {
  @IsString()
  classId: string;

  @IsString()
  className: string;

  @IsString()
  level: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsDateString()
  enrollmentDate: string;

  @IsEnum(['active', 'inactive', 'transferred', 'graduated'])
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
}

class MedicalInfoDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  specialNeeds?: string;
}

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  studentNumber: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ParentContactDto)
  parentContact: ParentContactDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AcademicInfoDto)
  academicInfo: AcademicInfoDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  medicalInfo?: MedicalInfoDto;
} 
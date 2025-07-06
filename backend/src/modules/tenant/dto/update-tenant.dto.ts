import { IsEnum, IsOptional, IsString, IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TenantStatus } from '../../../common/interfaces/tenant.interface';

class UpdateTenantSettingsDto {
  @IsOptional()
  @IsString()
  schoolType?: 'primary' | 'secondary' | 'university' | 'mixed';

  @IsOptional()
  @IsString()
  academicYearStart?: string;

  @IsOptional()
  @IsString()
  academicYearEnd?: string;

  @IsOptional()
  @IsString()
  gradeSystem?: 'numeric' | 'letter' | 'points';

  @IsOptional()
  maxGrade?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTenantSettingsDto)
  settings?: UpdateTenantSettingsDto;

  @IsOptional()
  @IsObject()
  subscription?: any;
} 
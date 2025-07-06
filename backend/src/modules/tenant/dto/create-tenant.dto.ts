import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  IsPositive, 
  Min, 
  Max, 
  Matches, 
  Length,
  ValidateNested,
  IsDateString,
  IsArray,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionPlan } from '../../../common/interfaces/tenant.interface';

export class ThemeDto {
  @IsString()
  @IsOptional()
  primaryColor?: string = '#1f2937';

  @IsString()
  @IsOptional()
  secondaryColor?: string = '#3b82f6';

  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class CreateTenantSettingsDto {
  @IsEnum(['primary', 'secondary', 'university', 'mixed'])
  schoolType: 'primary' | 'secondary' | 'university' | 'mixed';

  @IsString()
  @IsOptional()
  academicYearStart?: string = '09-01';

  @IsString()
  @IsOptional()
  academicYearEnd?: string = '07-15';

  @IsEnum(['numeric', 'letter', 'points'])
  gradeSystem: 'numeric' | 'letter' | 'points';

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxGrade?: number = 20;

  @IsString()
  @IsOptional()
  language?: string = 'fr';

  @IsString()
  @IsOptional()
  timezone?: string = 'Europe/Paris';

  @IsString()
  @IsOptional()
  currency?: string = 'EUR';

  @ValidateNested()
  @Type(() => ThemeDto)
  @IsOptional()
  theme?: ThemeDto;
}

// Nouveau DTO pour l'administrateur
export class CreateAdminDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  title?: string; // Directeur, Principal, etc.
}

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @IsPositive()
  maxStudents: number;

  @IsNumber()
  @IsPositive()
  maxTeachers: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[] = [];

  @IsNumber()
  @Min(0)
  pricePerMonth: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;
}

export class CreateTenantDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 50)
  @Matches(/^[a-z0-9-]+$/, { 
    message: 'Le domaine ne peut contenir que des lettres minuscules, chiffres et tirets' 
  })
  domain: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ValidateNested()
  @Type(() => CreateTenantSettingsDto)
  settings: CreateTenantSettingsDto;

  @ValidateNested()
  @Type(() => CreateSubscriptionDto)
  subscription: CreateSubscriptionDto;

  // Nouveau champ pour l'administrateur
  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
} 
import { IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PeriodDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNumber()
  order: number;
}

export class CreateAcademicYearDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodDto)
  periods?: PeriodDto[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'archived'])
  status?: string;
} 
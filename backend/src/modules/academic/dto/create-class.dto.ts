import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsMongoId, Min, Max } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  level: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  capacity: number;

  @IsEnum(['primary', 'middle', 'high', 'university'])
  schoolType: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsMongoId()
  mainTeacher?: string;

  @IsMongoId()
  academicYearId: string;

  @IsOptional()
  @IsString()
  classroom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'archived'])
  status?: string;
} 
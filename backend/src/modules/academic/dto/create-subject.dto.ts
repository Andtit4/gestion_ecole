import { IsString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  credits?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursPerWeek?: number;

  @IsOptional()
  @IsEnum(['theory', 'practical', 'mixed'])
  type?: string;
} 
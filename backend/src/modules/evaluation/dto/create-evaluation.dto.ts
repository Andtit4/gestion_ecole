import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, Min } from 'class-validator';
import { EvaluationType, GradeScale } from '../schemas/evaluation.schema';

export class CreateEvaluationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EvaluationType)
  type: EvaluationType;

  @IsString()
  subjectId: string;

  @IsString()
  classId: string;

  @IsString()
  teacherId: string;

  @IsString()
  academicYearId: string;

  @IsOptional()
  @IsString()
  periodId?: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(1)
  maxScore: number;

  @IsNumber()
  @Min(0.1)
  coefficient: number;

  @IsOptional()
  @IsEnum(GradeScale)
  scale?: GradeScale;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
} 
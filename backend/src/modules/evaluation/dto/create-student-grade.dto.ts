import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateStudentGradeDto {
  @IsString()
  evaluationId: string;

  @IsString()
  studentId: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsNumber()
  @Min(1)
  maxScore: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isAbsent?: boolean;

  @IsString()
  gradedBy: string;
} 
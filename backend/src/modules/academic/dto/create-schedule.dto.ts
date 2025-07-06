import { IsString, IsOptional, IsNumber, IsEnum, IsMongoId, IsBoolean, IsDateString, Min, Max, Matches, ValidateIf } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  name: string;

  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    message: 'dayOfWeek must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday'
  })
  dayOfWeek: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format'
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format'
  })
  endTime: string;

  @IsNumber()
  @Min(15)
  @Max(240)
  duration: number;

  @IsOptional()
  @IsMongoId()
  subjectId?: string;

  @IsMongoId()
  classId: string;

  @IsOptional()
  @IsMongoId()
  teacherId?: string;

  @IsMongoId()
  academicYearId: string;

  @IsOptional()
  @IsString()
  classroom?: string;

  @IsEnum(['course', 'td', 'tp', 'exam', 'break', 'other'], {
    message: 'type must be one of: course, td, tp, exam, break, other'
  })
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'cancelled'])
  status?: string;
} 
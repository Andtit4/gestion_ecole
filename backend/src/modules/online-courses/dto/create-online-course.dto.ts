import { IsString, IsOptional, IsInt, IsEnum, IsDateString, IsObject, IsBoolean, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CourseStatus, ParticipantType } from '../schemas/online-course.schema';

export class CreateTeacherDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}

export class CreateParticipantDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEnum(ParticipantType)
  type: ParticipantType;

  @IsOptional()
  @IsString()
  email?: string;
}

export class CourseSettingsDto {
  @IsOptional()
  @IsBoolean()
  allowRecording?: boolean = true;

  @IsOptional()
  @IsBoolean()
  requirePassword?: boolean = false;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  waitingRoom?: boolean = false;
}

export class CreateOnlineCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  subject: string;

  @IsString()
  className: string;

  @IsDateString()
  startTime: string;

  @IsInt()
  @Min(15)
  @Max(300)
  duration: number; // en minutes

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus = CourseStatus.SCHEDULED;

  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @ValidateNested()
  @Type(() => CreateTeacherDto)
  teacher: CreateTeacherDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxParticipants?: number = 50;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateParticipantDto)
  @IsArray()
  participants?: CreateParticipantDto[];

  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CourseSettingsDto)
  settings?: CourseSettingsDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class JoinCourseDto {
  @IsString()
  courseId: string;

  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsEnum(ParticipantType)
  userType: ParticipantType;

  @IsOptional()
  @IsString()
  email?: string;
}

export class LeaveCourseDto {
  @IsString()
  courseId: string;

  @IsString()
  userId: string;
}

export class UpdateCourseStatusDto {
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsOptional()
  @IsDateString()
  endTime?: string;
} 
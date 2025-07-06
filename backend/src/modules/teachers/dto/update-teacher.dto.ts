import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @IsOptional()
  @IsEnum(['active', 'inactive', 'on_leave', 'terminated'])
  status?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineCourseDto } from './create-online-course.dto';

export class UpdateOnlineCourseDto extends PartialType(CreateOnlineCourseDto) {} 
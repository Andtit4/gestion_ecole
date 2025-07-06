import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { AcademicYear, AcademicYearSchema } from './schemas/academic-year.schema';
import { Class, ClassSchema } from './schemas/class.schema';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcademicYear.name, schema: AcademicYearSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {} 
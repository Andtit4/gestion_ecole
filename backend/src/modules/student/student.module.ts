import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentSchema } from './schemas/student.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    UsersModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService, MongooseModule],
})
export class StudentModule {} 
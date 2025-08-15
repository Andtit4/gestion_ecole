import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OnlineCoursesService } from './online-courses.service';
import { OnlineCoursesController } from './online-courses.controller';
import { OnlineCourse, OnlineCourseSchema } from './schemas/online-course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnlineCourse.name, schema: OnlineCourseSchema },
    ]),
  ],
  controllers: [OnlineCoursesController],
  providers: [OnlineCoursesService],
  exports: [OnlineCoursesService],
})
export class OnlineCoursesModule {} 
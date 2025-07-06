import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TeacherManagement, TeacherManagementSchema } from './schemas/teacher-management.schema';
import { TenantModule } from '../tenant/tenant.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TeacherManagement.name, schema: TeacherManagementSchema }]),
    TenantModule,
    UsersModule,
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}

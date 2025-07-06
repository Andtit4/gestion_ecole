import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminAuthGuard } from './guards/super-admin-auth.guard';

@Module({
  controllers: [SuperAdminController],
  providers: [SuperAdminService, SuperAdminAuthGuard],
  exports: [SuperAdminService, SuperAdminAuthGuard],
})
export class SuperAdminModule {} 
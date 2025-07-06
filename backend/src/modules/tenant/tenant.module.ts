import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { DashboardController } from './dashboard.controller';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UsersModule,
  ],
  controllers: [TenantController, DashboardController],
  providers: [TenantService],
  exports: [TenantService, MongooseModule],
})
export class TenantModule {}

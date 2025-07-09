import { Controller, Get, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('stats')
  async getStats() {
    return await this.tenantService.getDashboardStats();
  }

  @Get('tenant/:id/stats')
  async getTenantStats(@Param('id') tenantId: string) {
    return await this.tenantService.getTenantStats(tenantId);
  }
} 
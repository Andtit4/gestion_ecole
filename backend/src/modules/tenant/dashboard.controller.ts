import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('stats')
  async getStats() {
    return await this.tenantService.getDashboardStats();
  }
} 
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlan } from '../../common/interfaces/tenant.interface';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlanDetails() {
    return this.subscriptionService.getPlanDetails();
  }

  // Nouveaux endpoints pour l'administration des abonnements
  @Get('admin/overview')
  async getSubscriptionOverview() {
    return await this.subscriptionService.getSubscriptionOverview();
  }

  @Get('admin/list')
  async getAllSubscriptions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('plan') plan?: SubscriptionPlan,
    @Query('status') status?: 'active' | 'expired' | 'cancelled' | 'expiring_soon',
    @Query('search') search?: string,
  ) {
    return await this.subscriptionService.getAllSubscriptions(page, limit, { plan, status, search });
  }

  @Get('admin/stats')
  async getSubscriptionStats() {
    return await this.subscriptionService.getSubscriptionStats();
  }

  @Get('admin/revenue')
  async getRevenueStats(
    @Query('period') period: 'monthly' | 'yearly' = 'monthly',
  ) {
    return await this.subscriptionService.getRevenueStats(period);
  }

  @Post('admin/bulk-update')
  async bulkUpdateSubscriptions(
    @Body() data: {
      tenantIds: string[];
      action: 'change_plan' | 'extend' | 'cancel' | 'reactivate';
      plan?: SubscriptionPlan;
      duration?: number;
    },
  ) {
    return await this.subscriptionService.bulkUpdateSubscriptions(data);
  }

  @Post('admin/notify-expiring')
  async notifyExpiringSubscriptions() {
    return await this.subscriptionService.notifyExpiringSubscriptions();
  }

  @Get('admin/export')
  async exportSubscriptionData(
    @Query('format') format: 'csv' | 'xlsx' = 'csv',
  ) {
    return await this.subscriptionService.exportSubscriptionData(format);
  }

  // Endpoints existants
  @Get(':tenantId/usage')
  async getUsageStats(@Param('tenantId') tenantId: string) {
    return await this.subscriptionService.getUsageStats(tenantId);
  }

  @Get(':tenantId/billing-history')
  async getBillingHistory(@Param('tenantId') tenantId: string) {
    return await this.subscriptionService.getBillingHistory(tenantId);
  }

  @Post(':tenantId/upgrade')
  async upgradePlan(
    @Param('tenantId') tenantId: string,
    @Body('plan') plan: SubscriptionPlan,
    @Body('duration', new DefaultValuePipe(12), ParseIntPipe) duration: number,
  ) {
    return await this.subscriptionService.upgradePlan(tenantId, plan, duration);
  }

  @Post(':tenantId/downgrade')
  async downgradePlan(
    @Param('tenantId') tenantId: string,
    @Body('plan') plan: SubscriptionPlan,
  ) {
    return await this.subscriptionService.downgradePlan(tenantId, plan);
  }

  @Post(':tenantId/renew')
  async renewSubscription(
    @Param('tenantId') tenantId: string,
    @Body('duration', new DefaultValuePipe(12), ParseIntPipe) duration: number,
  ) {
    return await this.subscriptionService.renewSubscription(tenantId, duration);
  }

  @Patch(':tenantId/cancel')
  async cancelSubscription(@Param('tenantId') tenantId: string) {
    return await this.subscriptionService.cancelSubscription(tenantId);
  }

  @Post('create')
  async createSubscription(
    @Body('tenantId') tenantId: string,
    @Body('plan') plan: SubscriptionPlan,
    @Body('duration', new DefaultValuePipe(12), ParseIntPipe) duration: number,
  ) {
    return await this.subscriptionService.createSubscription(tenantId, plan, duration);
  }

  @Post('plans/custom')
  async createCustomPlan(
    @Body() planData: {
      name: string;
      description: string;
      monthlyPrice: number;
      validity?: string;
      maxStudents: number;
      maxTeachers: number;
      features: string[];
    },
  ) {
    return await this.subscriptionService.createCustomPlan(planData);
  }

  @Get('plans/custom')
  async getCustomPlans() {
    return await this.subscriptionService.getCustomPlans();
  }

  @Post(':tenantId/assign-custom-plan')
  async assignCustomPlan(
    @Param('tenantId') tenantId: string,
    @Body('planId') planId: string,
    @Body('duration', new DefaultValuePipe(12), ParseIntPipe) duration: number,
  ) {
    return await this.subscriptionService.assignCustomPlan(tenantId, planId, duration);
  }

  // Nouveaux endpoints pour la gestion complète des plans
  @Get('plans/all')
  async getAllPlans() {
    return await this.subscriptionService.getAllPlans();
  }

  @Get('plans/custom/:id')
  async getCustomPlan(@Param('id') planId: string) {
    return await this.subscriptionService.getCustomPlan(planId);
  }

  @Patch('plans/custom/:id')
  async updateCustomPlan(
    @Param('id') planId: string,
    @Body() updateData: {
      name?: string;
      description?: string;
      monthlyPrice?: number;
      validity?: string;
      maxStudents?: number;
      maxTeachers?: number;
      features?: string[];
      popular?: boolean;
    },
  ) {
    return await this.subscriptionService.updateCustomPlan(planId, updateData);
  }

  @Delete('plans/custom/:id')
  async deleteCustomPlan(@Param('id') planId: string) {
    return await this.subscriptionService.deleteCustomPlan(planId);
  }
} 
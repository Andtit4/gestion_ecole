import {
  Controller,
  Get,
  Post,
  Patch,
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
} 
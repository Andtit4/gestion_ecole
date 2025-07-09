import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant } from '../tenant/schemas/tenant.schema';
import { CustomPlan, CustomPlanDocument } from './schemas/custom-plan.schema';
import { SubscriptionPlan } from '../../common/interfaces/tenant.interface';

export interface PlanDetails {
  name: string;
  pricePerMonth: number;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  description: string;
}

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(CustomPlan.name) private customPlanModel: Model<CustomPlanDocument>,
  ) {}

  getPlanDetails(): Record<SubscriptionPlan, PlanDetails> {
    return {
      [SubscriptionPlan.STARTER]: {
        name: 'Plan Starter',
        pricePerMonth: 5000,
        maxStudents: 50,
        maxTeachers: 5,
        features: [
          'Gestion des élèves',
          'Gestion des notes de base',
          'Bulletins simples',
          'Support par email',
        ],
        description: 'Pour les petites écoles',
      },
      [SubscriptionPlan.STANDARD]: {
        name: 'Plan Standard',
        pricePerMonth: 10000,
        maxStudents: 200,
        maxTeachers: 20,
        features: [
          'Toutes les fonctionnalités Starter',
          'Emplois du temps avancés',
          'Communication avec les parents',
          'Gestion des absences',
          'Rapports détaillés',
          'Support prioritaire',
        ],
        description: 'Le choix idéal pour la plupart des établissements',
      },
      [SubscriptionPlan.ENTERPRISE]: {
        name: 'Plan Enterprise',
        pricePerMonth: 150000,
        maxStudents: 999999, // Illimité
        maxTeachers: 999999, // Illimité
        features: [
          'Toutes les fonctionnalités Standard',
          'Multi-établissements',
          'API complète',
          'Intégrations personnalisées',
          'Formation dédiée',
          'Support 24/7',
          'Gestionnaire de compte dédié',
          'Sauvegarde avancée',
        ],
        description: 'Pour les grandes institutions',
      },
      [SubscriptionPlan.CUSTOM]: {
        name: 'Plan Personnalisé',
        pricePerMonth: 0, // Sera remplacé par les valeurs du plan personnalisé
        maxStudents: 0, // Sera remplacé par les valeurs du plan personnalisé
        maxTeachers: 0, // Sera remplacé par les valeurs du plan personnalisé
        features: [], // Sera remplacé par les valeurs du plan personnalisé
        description: 'Plan personnalisé selon vos besoins',
      },
    };
  }

  async upgradePlan(
    tenantId: string,
    newPlan: SubscriptionPlan,
    duration: number = 12, // en mois
  ): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    const planDetails = this.getPlanDetails()[newPlan];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const updatedTenant = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        'subscription.plan': newPlan,
        'subscription.maxStudents': planDetails.maxStudents,
        'subscription.maxTeachers': planDetails.maxTeachers,
        'subscription.pricePerMonth': planDetails.pricePerMonth,
        'subscription.features': planDetails.features,
        'subscription.startDate': startDate,
        'subscription.endDate': endDate,
        'subscription.isActive': true,
      },
      { new: true },
    );

    return {
      tenant: updatedTenant,
      invoice: this.generateInvoice(planDetails, duration, startDate),
    };
  }

  async downgradePlan(
    tenantId: string,
    newPlan: SubscriptionPlan,
  ): Promise<any> {
    // La rétrogradation prend effet à la fin de la période actuelle
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    const planDetails = this.getPlanDetails()[newPlan];

    // Programmer le changement pour la fin de la période
    const changeDate = tenant.subscription.endDate;

    return {
      message: 'Rétrogradation programmée',
      changeDate,
      newPlan: planDetails,
      currentPlan: tenant.subscription.plan,
    };
  }

  async cancelSubscription(tenantId: string): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    // Marquer comme annulé mais garder actif jusqu'à la fin de la période
    await this.tenantModel.findByIdAndUpdate(tenantId, {
      'subscription.isActive': false,
    });

    return {
      message: 'Abonnement annulé',
      endDate: tenant.subscription.endDate,
      note: "Votre abonnement restera actif jusqu'à la date d'expiration",
    };
  }

  async renewSubscription(
    tenantId: string,
    duration: number = 12,
  ): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    const currentEndDate = tenant.subscription.endDate;
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + duration);

    const updatedTenant = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        'subscription.endDate': newEndDate,
        'subscription.isActive': true,
      },
      { new: true },
    );

    const planDetails = this.getPlanDetails()[tenant.subscription.plan];

    return {
      tenant: updatedTenant,
      invoice: this.generateInvoice(planDetails, duration, new Date()),
    };
  }

  async getUsageStats(tenantId: string): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    // TODO: Calculer les statistiques d'utilisation réelles
    // Pour l'instant, on retourne des données simulées
    const currentStudents = Math.floor(
      Math.random() * tenant.subscription.maxStudents,
    );
    const currentTeachers = Math.floor(
      Math.random() * tenant.subscription.maxTeachers,
    );

    return {
      currentStudents,
      maxStudents: tenant.subscription.maxStudents,
      studentUsagePercent: Math.round(
        (currentStudents / tenant.subscription.maxStudents) * 100,
      ),

      currentTeachers,
      maxTeachers: tenant.subscription.maxTeachers,
      teacherUsagePercent: Math.round(
        (currentTeachers / tenant.subscription.maxTeachers) * 100,
      ),

      subscription: tenant.subscription,
      daysUntilExpiry: Math.ceil(
        (tenant.subscription.endDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    };
  }

  private generateInvoice(
    planDetails: PlanDetails,
    duration: number,
    startDate: Date,
  ): any {
    const totalAmount = planDetails.pricePerMonth * duration;
    const tax = totalAmount * 0.2; // TVA 20%
    const totalWithTax = totalAmount + tax;

    return {
      invoiceNumber: `INV-${Date.now()}`,
      date: startDate,
      plan: planDetails.name,
      duration,
      unitPrice: planDetails.pricePerMonth,
      subtotal: totalAmount,
      tax,
      total: totalWithTax,
      currency: 'XOF',
    };
  }

  async getBillingHistory(tenantId: string): Promise<any[]> {
    // TODO: Implémenter l'historique de facturation réel
    // Pour l'instant, retourner des données simulées
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async
    
    if (!tenantId) {
      throw new NotFoundException('ID tenant requis');
    }
    
    return [
      {
        invoiceNumber: 'INV-001',
        date: new Date('2024-01-01'),
        amount: 10000,
        status: 'paid',
        plan: 'Standard',
      },
      {
        invoiceNumber: 'INV-002',
        date: new Date('2024-02-01'),
        amount: 10000,
        status: 'paid',
        plan: 'Standard',
      },
    ];
  }

  async createSubscription(
    tenantId: string,
    plan: SubscriptionPlan,
    duration: number = 12,
  ): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    const planDetails = this.getPlanDetails()[plan];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const updatedTenant = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        'subscription.plan': plan,
        'subscription.maxStudents': planDetails.maxStudents,
        'subscription.maxTeachers': planDetails.maxTeachers,
        'subscription.pricePerMonth': planDetails.pricePerMonth,
        'subscription.features': planDetails.features,
        'subscription.startDate': startDate,
        'subscription.endDate': endDate,
        'subscription.isActive': true,
      },
      { new: true },
    );

    return {
      subscription: updatedTenant?.subscription,
      invoice: this.generateInvoice(planDetails, duration, startDate),
    };
  }

  async createCustomPlan(planData: {
    name: string;
    description: string;
    monthlyPrice: number;
    validity?: string;
    maxStudents: number;
    maxTeachers: number;
    features: string[];
  }): Promise<CustomPlanDocument> {
    const customPlan = new this.customPlanModel(planData);
    return await customPlan.save();
  }

  async getCustomPlans(): Promise<CustomPlanDocument[]> {
    return await this.customPlanModel.find({ isActive: true }).exec();
  }

  async getAllPlans(): Promise<any> {
    // Récupérer uniquement les plans personnalisés enregistrés
    const customPlans = await this.getCustomPlans();
    const customPlansArray = customPlans.map(plan => ({
      id: String(plan._id),
      type: 'custom',
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      validity: plan.validity || 'monthly',
      maxStudents: plan.maxStudents,
      maxTeachers: plan.maxTeachers,
      features: plan.features,
      popular: plan.popular || false,
    }));

    return {
      plans: customPlansArray,
      total: customPlansArray.length
    };
  }

  async getCustomPlan(planId: string): Promise<CustomPlanDocument> {
    const plan = await this.customPlanModel.findById(planId);
    if (!plan) {
      throw new NotFoundException('Plan personnalisé non trouvé');
    }
    return plan;
  }

  async updateCustomPlan(
    planId: string,
    updateData: {
      name?: string;
      description?: string;
      monthlyPrice?: number;
      validity?: string;
      maxStudents?: number;
      maxTeachers?: number;
      features?: string[];
      popular?: boolean;
    },
  ): Promise<CustomPlanDocument> {
    const updatedPlan = await this.customPlanModel.findByIdAndUpdate(
      planId,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    );

    if (!updatedPlan) {
      throw new NotFoundException('Plan personnalisé non trouvé');
    }

    return updatedPlan;
  }

  async deleteCustomPlan(planId: string): Promise<{ message: string }> {
    // Vérifier que le plan n'est pas utilisé par des tenants
    const tenantsUsingPlan = await this.tenantModel.find({
      'subscription.customPlanId': planId,
      'subscription.isActive': true,
    });

    if (tenantsUsingPlan.length > 0) {
      throw new Error(
        `Impossible de supprimer ce plan : ${tenantsUsingPlan.length} établissement(s) l'utilisent encore`
      );
    }

    const deletedPlan = await this.customPlanModel.findByIdAndDelete(planId);
    if (!deletedPlan) {
      throw new NotFoundException('Plan personnalisé non trouvé');
    }

    return { message: 'Plan personnalisé supprimé avec succès' };
  }

  async assignCustomPlan(
    tenantId: string,
    planId: string,
    duration: number = 12,
  ): Promise<any> {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }

    const customPlan = await this.customPlanModel.findById(planId);
    if (!customPlan) {
      throw new NotFoundException('Plan personnalisé non trouvé');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const updatedTenant = await this.tenantModel.findByIdAndUpdate(
      tenantId,
      {
        'subscription.plan': 'custom',
        'subscription.customPlanId': planId,
        'subscription.maxStudents': customPlan.maxStudents,
        'subscription.maxTeachers': customPlan.maxTeachers,
        'subscription.pricePerMonth': customPlan.monthlyPrice,
        'subscription.features': customPlan.features,
        'subscription.startDate': startDate,
        'subscription.endDate': endDate,
        'subscription.isActive': true,
      },
      { new: true },
    );

    return {
      tenant: updatedTenant,
      customPlan,
      invoice: this.generateInvoice(
        {
          name: customPlan.name,
          pricePerMonth: customPlan.monthlyPrice,
          maxStudents: customPlan.maxStudents,
          maxTeachers: customPlan.maxTeachers,
          features: customPlan.features,
          description: customPlan.description,
        },
        duration,
        startDate,
      ),
    };
  }

  // Nouvelles méthodes pour l'administration des abonnements
  async getSubscriptionOverview(): Promise<any> {
    const totalTenants = await this.tenantModel.countDocuments();
    const activeTenants = await this.tenantModel.countDocuments({
      'subscription.isActive': true,
    });
    
    const expiringTenants = await this.tenantModel.countDocuments({
      'subscription.endDate': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      },
      'subscription.isActive': true,
    });

    const monthlyRevenue = await this.calculateMonthlyRevenue();

    return {
      totalEstablishments: totalTenants,
      activeSubscriptions: activeTenants,
      expiringSoon: expiringTenants,
      monthlyRevenue,
      lastUpdated: new Date(),
    };
  }

  async getAllSubscriptions(
    page: number,
    limit: number,
    filters: {
      plan?: SubscriptionPlan;
      status?: 'active' | 'expired' | 'cancelled' | 'expiring_soon';
      search?: string;
    },
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Filtres
    if (filters.plan) {
      query['subscription.plan'] = filters.plan;
    }

    if (filters.status) {
      switch (filters.status) {
        case 'active':
          query['subscription.isActive'] = true;
          query['subscription.endDate'] = { $gte: new Date() };
          break;
        case 'expired':
          query['subscription.endDate'] = { $lt: new Date() };
          break;
        case 'cancelled':
          query['subscription.isActive'] = false;
          break;
        case 'expiring_soon':
          query['subscription.isActive'] = true;
          query['subscription.endDate'] = {
            $gte: new Date(),
            $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          };
          break;
      }
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { domain: { $regex: filters.search, $options: 'i' } },
        { 'adminUser.email': { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [tenants, total] = await Promise.all([
      this.tenantModel
        .find(query)
        .select('name domain subscription adminUser.email createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.tenantModel.countDocuments(query),
    ]);

    return {
      data: tenants.map(tenant => ({
        id: tenant._id,
        name: tenant.name,
        domain: tenant.domain,
                 adminEmail: tenant.admin?.email,
        plan: tenant.subscription?.plan,
        status: this.getSubscriptionStatus(tenant.subscription),
        monthlyPrice: tenant.subscription?.pricePerMonth / 100,
        endDate: tenant.subscription?.endDate,
        daysRemaining: this.calculateDaysRemaining(tenant.subscription?.endDate),
        createdAt: tenant.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSubscriptionStats(): Promise<any> {
    const planStats = await this.tenantModel.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 },
          revenue: { $sum: '$subscription.pricePerMonth' },
        },
      },
    ]);

    const statusStats = await this.tenantModel.aggregate([
      {
        $addFields: {
          status: {
            $cond: {
              if: { $lt: ['$subscription.endDate', new Date()] },
              then: 'expired',
              else: {
                $cond: {
                  if: { $eq: ['$subscription.isActive', false] },
                  then: 'cancelled',
                  else: 'active',
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      planDistribution: planStats,
      statusDistribution: statusStats,
      totalRevenue: planStats.reduce((sum, plan) => sum + plan.revenue, 0) / 100,
    };
  }

  async getRevenueStats(period: 'monthly' | 'yearly'): Promise<any> {
    const groupBy = period === 'monthly' 
      ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
      : { year: { $year: '$createdAt' } };

    const revenueData = await this.tenantModel.aggregate([
      {
        $match: {
          'subscription.isActive': true,
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$subscription.pricePerMonth' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return {
      period,
      data: revenueData.map(item => ({
        period: period === 'monthly' 
          ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
          : String(item._id.year),
        revenue: item.revenue / 100,
        subscriptions: item.count,
      })),
    };
  }

  async bulkUpdateSubscriptions(data: {
    tenantIds: string[];
    action: 'change_plan' | 'extend' | 'cancel' | 'reactivate';
    plan?: SubscriptionPlan;
    duration?: number;
  }): Promise<any> {
    const results: Array<{
      tenantId: string;
      success: boolean;
      result?: any;
      error?: string;
    }> = [];

    for (const tenantId of data.tenantIds) {
      try {
        let result;
        switch (data.action) {
          case 'change_plan':
            if (!data.plan) throw new Error('Plan requis');
            result = await this.upgradePlan(tenantId, data.plan, data.duration || 12);
            break;
          case 'extend':
            result = await this.renewSubscription(tenantId, data.duration || 12);
            break;
          case 'cancel':
            result = await this.cancelSubscription(tenantId);
            break;
          case 'reactivate':
            result = await this.tenantModel.findByIdAndUpdate(
              tenantId,
              { 'subscription.isActive': true },
              { new: true }
            );
            break;
        }
        results.push({ tenantId, success: true, result });
      } catch (error: any) {
        results.push({ tenantId, success: false, error: error.message });
      }
    }

    return {
      processed: data.tenantIds.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  async notifyExpiringSubscriptions(): Promise<any> {
    const expiringTenants = await this.tenantModel.find({
      'subscription.isActive': true,
      'subscription.endDate': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // TODO: Implémenter l'envoi d'emails de notification
    // Pour l'instant, on retourne juste la liste

    return {
      count: expiringTenants.length,
      tenants: expiringTenants.map(tenant => ({
        id: tenant._id,
        name: tenant.name,
        email: tenant.admin?.email,
        endDate: tenant.subscription.endDate,
        daysRemaining: this.calculateDaysRemaining(tenant.subscription.endDate),
      })),
    };
  }

  async exportSubscriptionData(format: 'csv' | 'xlsx'): Promise<any> {
    const tenants = await this.tenantModel.find({}).select(
      'name domain subscription adminUser.email createdAt'
    );

    const data = tenants.map(tenant => ({
      'Nom': tenant.name,
      'Domaine': tenant.domain,
      'Email Admin': tenant.admin?.email,
      'Plan': tenant.subscription?.plan,
      'Statut': this.getSubscriptionStatus(tenant.subscription),
      'Prix Mensuel': tenant.subscription?.pricePerMonth / 100,
      'Date de Fin': tenant.subscription?.endDate?.toISOString().split('T')[0],
      'Jours Restants': this.calculateDaysRemaining(tenant.subscription?.endDate),
      'Date de Création': tenant.createdAt?.toISOString().split('T')[0],
    }));

    // TODO: Implémenter la génération de fichiers CSV/XLSX
    // Pour l'instant, on retourne les données JSON

    return {
      format,
      data,
      count: data.length,
      generatedAt: new Date(),
    };
  }

  // Méthodes utilitaires privées
  private async calculateMonthlyRevenue(): Promise<number> {
    const activeTenants = await this.tenantModel.find({
      'subscription.isActive': true,
    });
    
    return activeTenants.reduce((total, tenant) => {
      return total + (tenant.subscription?.pricePerMonth || 0);
    }, 0) / 100;
  }

  private getSubscriptionStatus(subscription: any): string {
    if (!subscription) return 'none';
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    
    if (endDate < now) return 'expired';
    if (!subscription.isActive) return 'cancelled';
    
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysRemaining <= 30) return 'expiring_soon';
    
    return 'active';
  }

  private calculateDaysRemaining(endDate: Date): number {
    if (!endDate) return 0;
    
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

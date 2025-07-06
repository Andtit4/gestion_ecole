import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        'subscription.plan': 'custom' as any,
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
}
